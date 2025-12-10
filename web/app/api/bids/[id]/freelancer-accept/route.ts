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

// POST /api/bids/[id]/freelancer-accept - Freelancer accepts winning bid
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = verifyToken(request);

    const bid = await prisma.bid.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!bid) {
      return NextResponse.json(
        { success: false, error: 'Bid not found' },
        { status: 404 }
      );
    }

    // Verify freelancer owns the bid
    if (bid.freelancerId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if bid won
    if (!bid.isWinner || bid.status !== 'won') {
      return NextResponse.json(
        { success: false, error: 'This bid did not win' },
        { status: 400 }
      );
    }

    // Check if acceptance deadline passed
    if (bid.acceptanceDeadline && new Date() > bid.acceptanceDeadline) {
      return NextResponse.json(
        { success: false, error: 'Acceptance deadline has passed' },
        { status: 400 }
      );
    }

    // Update bid status
    await prisma.bid.update({
      where: { id: params.id },
      data: {
        status: 'accepted',
      },
    });

    // Calculate advance amount (30%)
    const advanceAmount = bid.bidAmount * 0.3;

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        jobId: bid.jobId,
        clientId: bid.job.clientId,
        freelancerId: bid.freelancerId,
        amount: bid.bidAmount,
        advanceAmount,
        advancePercentage: 30,
        startDate: new Date(),
        estimatedDays: bid.proposedDays,
        status: 'PENDING_ADMIN_APPROVAL',
        terms: `Contract for "${bid.job.title}" - Amount: $${bid.bidAmount}, Advance: $${advanceAmount} (30%)`,
      },
    });

    // Update job status
    await prisma.job.update({
      where: { id: bid.jobId },
      data: {
        status: 'PENDING_ACCEPTANCE',
      },
    });

    // Notify client
    await prisma.notification.create({
      data: {
        userId: bid.job.clientId,
        type: 'contract_created',
        title: 'Contract Created',
        message: `Contract created for "${bid.job.title}". Pending admin approval.`,
        data: {
          contractId: contract.id,
          jobId: bid.jobId,
        },
      },
    });

    // Notify admin
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'contract_approval_needed',
          title: 'New Contract Needs Approval',
          message: `Contract for "${bid.job.title}" needs admin approval.`,
          data: {
            contractId: contract.id,
            jobId: bid.jobId,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { bid, contract },
      message: 'Bid accepted successfully. Contract created and pending admin approval.',
    });
  } catch (error: any) {
    console.error('Error accepting bid:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
