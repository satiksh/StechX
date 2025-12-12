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

// POST /api/admin/users/[id]/suspend - Suspend/Unsuspend user
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { suspend } = body; // true to suspend, false to unsuspend

    const { id } = await context.params;

    const user = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: suspend,
      },
    });

    await prisma.notification.create({
      data: {
        userId: id,
  type: suspend ? 'account_suspended' : 'account_restored',
        title: suspend ? 'Account Suspended' : 'Account Restored',
  message: suspend
          ? 'Your account has been suspended by an administrator. Please contact support.'
          : 'Your account has been restored. You can now access all features.',
      },
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: suspend ? 'User suspended successfully' : 'User unsuspended successfully',
    });
  } catch (error: any) {
    console.error('Error suspending user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
