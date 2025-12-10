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

// GET /api/contracts - Get user's contracts
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let where: any = {};

    if (decoded.role === 'CLIENT') {
      where.clientId = decoded.userId;
    } else if (decoded.role === 'FREELANCER' || decoded.role === 'AGENCY') {
      where.freelancerId = decoded.userId;
    } else if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (status) {
      where.status = status;
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        job: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
          },
        },
        payments: true,
        milestones: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: contracts,
    });
  } catch (error: any) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
