import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
}

// POST /api/bids/[id]/reject - Freelancer rejects winning bid OR Client rejects project
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);
    const body = await request.json();
    const { reason } = body;

    const { id } = await context.params;

    const bid = await prisma.bid.findUnique({
      where: { id },
      include: {
        job: true,
        freelancer: true,
      },
    });

    if (!bid) {
      return NextResponse.json(
        { success: false, error: 'Bid not found' },
        { status: 404 }
      );
    }

    // Update bid status
    await prisma.bid.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
    });

    // Increment rejection count and update freelancer's profile rating
    await prisma.job.update({
      where: { id: bid.jobId },
      data: {
        rejectionCount: { increment: 1 },
        lastRejectedAt: new Date(),
        status: 'REJECTED_REOPEN_REQUESTED', // Reopen for bidding
      },
    });

    // Decrease freelancer's profile rating
    const freelancer = await prisma.user.findUnique({
      where: { id: bid.freelancerId },
    });

    if (freelancer) {
      const newRating = Math.max(0, freelancer.profileRating - 0.5);
      await prisma.user.update({
        where: { id: bid.freelancerId },
        data: {
          profileRating: newRating,
        },
      });
    }

    // Notify client
    await prisma.notification.create({
      data: {
        userId: bid.job.clientId,
        type: 'bid_rejected',
        title: 'Bid Rejected',
        message: `The freelancer rejected the bid for "${bid.job.title}". Reason: ${reason || 'Not provided'}`,
        data: {
          bidId: bid.id,
          jobId: bid.jobId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bid rejected. Job reopened for new bids.',
    });
  } catch (error: any) {
    console.error('Error rejecting bid:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
