import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
}

// POST /api/bids/[id]/accept - Client accepts a bid
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);

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

    // Verify client owns the job
    if (bid.job.clientId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

  // Update bid status
    const updatedBid = await prisma.bid.update({
      where: { id },
      data: {
    status: 'ACCEPTED',
      },
    });

  // Mark other bids as rejected
    await prisma.bid.updateMany({
      where: {
        jobId: bid.jobId,
        id: { not: id },
      },
      data: {
    status: 'REJECTED',
      },
    });

    // Update job status
    await prisma.job.update({
      where: { id: bid.jobId },
      data: {
        status: 'BID_WON',
      },
    });

    // Notify freelancer
    await prisma.notification.create({
      data: {
        userId: bid.freelancerId,
  type: 'bid_won',
        title: 'Your bid was accepted',
  message: `Your bid of $${bid.bidAmount} for "${bid.job.title}" has been accepted.`,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBid,
  message: 'Bid accepted successfully.',
    });
  } catch (error: any) {
    console.error('Error accepting bid:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
