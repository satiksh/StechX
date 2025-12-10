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

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const suspended = searchParams.get('suspended');

    let where: any = {};

    if (role) {
      where.role = role;
    }

    if (suspended !== null) {
      where.isSuspended = suspended === 'true';
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        avatarUrl: true,
        isVerified: true,
        isSuspended: true,
        rating: true,
        totalEarnings: true,
        totalReviews: true,
        createdAt: true,
        lastLogin: true,
        _count: {
          select: {
            jobsPosted: true,
            proposals: true,
            contractsAsClient: true,
            contractsAsFreelancer: true,
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
