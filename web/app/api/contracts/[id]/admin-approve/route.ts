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

// POST /api/contracts/[id]/admin-approve - Admin approves contract
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only admins can approve contracts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { googleMeetLink } = body;

    const { id } = await context.params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        job: true,
        client: true,
        freelancer: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Update contract with admin approval and Google Meet link
    const updatedContract = await prisma.contract.update({
      where: { id },
      data: {
        status: 'PENDING_CLIENT_APPROVAL',
        adminApprovedAt: new Date(),
        googleMeetLink: googleMeetLink || null,
      },
    });

    // Create advance payment record (escrowed)
    await prisma.payment.create({
      data: {
        contractId: contract.id,
        amount: contract.advanceAmount,
        type: 'advance',
        status: 'ESCROWED',
        isEscrowed: true,
        description: `Advance payment (${contract.advancePercentage}%) for "${contract.job.title}"`,
        paymentMethod: 'escrow',
      },
    });

    // Notify client
    await prisma.notification.create({
      data: {
        userId: contract.clientId,
        type: 'contract_approved',
        title: 'Contract Approved by Admin',
        message: `Your contract for "${contract.job.title}" has been approved. Please review and sign.${googleMeetLink ? ` Kickoff meeting: ${googleMeetLink}` : ''}`,
        data: {
          contractId: contract.id,
          jobId: contract.jobId,
          googleMeetLink,
        },
      },
    });

    // Notify freelancer
    await prisma.notification.create({
      data: {
        userId: contract.freelancerId,
        type: 'contract_approved',
        title: 'Contract Approved by Admin',
        message: `Contract for "${contract.job.title}" has been approved.${googleMeetLink ? ` Kickoff meeting: ${googleMeetLink}` : ''}`,
        data: {
          contractId: contract.id,
          jobId: contract.jobId,
          googleMeetLink,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedContract,
      message: 'Contract approved successfully',
    });
  } catch (error: any) {
    console.error('Error approving contract:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
