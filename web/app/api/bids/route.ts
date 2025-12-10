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

// GET /api/bids - Get user's bids
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    let where: any = {};

    if (decoded.role === 'FREELANCER' || decoded.role === 'AGENCY') {
      where.freelancerId = decoded.userId;
    }

    if (jobId) {
      where.jobId = jobId;
    }

    const bids = await prisma.bid.findMany({
      where,
      include: {
        job: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                rating: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: bids,
    });
  } catch (error: any) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/bids - Create new bid
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role !== 'FREELANCER' && decoded.role !== 'AGENCY') {
      return NextResponse.json(
        { success: false, error: 'Only freelancers/agencies can place bids' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { jobId, bidAmount, proposedDays, coverLetter } = body;

    if (!jobId || !bidAmount) {
      return NextResponse.json(
        { success: false, error: 'Job ID and bid amount are required' },
        { status: 400 }
      );
    }

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if bidding period has ended
    if (job.biddingEndsAt && new Date() > job.biddingEndsAt) {
      return NextResponse.json(
        { success: false, error: 'Bidding period has ended' },
        { status: 400 }
      );
    }

    // Check if bid is within 80% limit
    if (job.maxBidPrice && bidAmount > job.maxBidPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Bid amount cannot exceed ${job.maxBidPrice} (80% of budget)` 
        },
        { status: 400 }
      );
    }

    // Check if user already bid on this job
    const existingBid = await prisma.bid.findUnique({
      where: {
        jobId_freelancerId: {
          jobId,
          freelancerId: decoded.userId,
        },
      },
    });

    if (existingBid) {
      return NextResponse.json(
        { success: false, error: 'You have already placed a bid on this job' },
        { status: 400 }
      );
    }

    const bid = await prisma.bid.create({
      data: {
        jobId,
        freelancerId: decoded.userId,
        bidAmount,
        proposedDays,
        coverLetter,
        status: 'pending',
      },
      include: {
        job: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            rating: true,
          },
        },
      },
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        userId: job.clientId,
        type: 'new_bid',
        title: 'New Bid Received',
        message: `You received a new bid of $${bidAmount} for "${job.title}"`,
        data: {
          bidId: bid.id,
          jobId: job.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: bid,
      message: 'Bid placed successfully',
    });
  } catch (error: any) {
    console.error('Error creating bid:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
