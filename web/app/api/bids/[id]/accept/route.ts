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

    // Set acceptance deadline (24 hours from now)
    const acceptanceDeadline = new Date();
    acceptanceDeadline.setHours(acceptanceDeadline.getHours() + 24);

    // Update bid status to won
    const updatedBid = await prisma.bid.update({
      where: { id },
      data: {
        isWinner: true,
        status: 'won',
        acceptanceDeadline,
      },
    });

    // Mark other bids as lost
    await prisma.bid.updateMany({
      where: {
        jobId: bid.jobId,
        id: { not: id },
      },
      data: {
        status: 'lost',
      },
    });

    // Update job status
    await prisma.job.update({
      where: { id: bid.jobId },
      data: {
        status: 'BID_WON',
        assignedFreelancerId: bid.freelancerId,
      },
    });

    // Notify freelancer
    await prisma.notification.create({
      data: {
        userId: bid.freelancerId,
        type: 'bid_won',
        title: 'Congratulations! Your Bid Won',
        message: `Your bid of $${bid.bidAmount} for "${bid.job.title}" has been accepted. You have 24 hours to accept.`,
        data: {
          bidId: bid.id,
          jobId: bid.jobId,
          acceptanceDeadline: acceptanceDeadline.toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBid,
      message: 'Bid accepted successfully. Freelancer has 24 hours to accept.',
    });
  } catch (error: any) {
    console.error('Error accepting bid:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
