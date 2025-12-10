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

// GET /api/admin/stats - Get platform statistics
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get counts
    const [
      totalUsers,
      totalClients,
      totalFreelancers,
      totalProjects,
      activeProjects,
      totalContracts,
      activeContracts,
      pendingContracts,
      totalBids,
      totalPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: { in: ['FREELANCER', 'AGENCY'] } } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS', 'BIDDING'] } } }),
      prisma.contract.count(),
      prisma.contract.count({ where: { status: 'ACTIVE' } }),
      prisma.contract.count({ where: { status: { in: ['PENDING_ADMIN_APPROVAL', 'PENDING_CLIENT_APPROVAL'] } } }),
      prisma.bid.count(),
      prisma.payment.count(),
    ]);

    // Calculate total platform value
    const payments = await prisma.payment.findMany({
      where: { status: 'COMPLETED' },
    });
    const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const recentProjects = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        budget: true,
        status: true,
        createdAt: true,
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalClients,
          totalFreelancers,
          totalProjects,
          activeProjects,
          totalContracts,
          activeContracts,
          pendingContracts,
          totalBids,
          totalPayments,
          totalRevenue,
        },
        recentActivity: {
          users: recentUsers,
          projects: recentProjects,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
