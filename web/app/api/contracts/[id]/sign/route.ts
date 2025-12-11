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

// POST /api/contracts/[id]/sign - Client or Freelancer signs contract
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyToken(request);

    const { id } = await context.params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contract not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    if (decoded.userId === contract.clientId) {
      updateData.signedByClient = true;
      updateData.clientApprovedAt = new Date();
    } else if (decoded.userId === contract.freelancerId) {
      updateData.signedByFreelancer = true;
    } else {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if both parties will have signed
    const willBeFullySigned = 
      (updateData.signedByClient || contract.signedByClient) &&
      (updateData.signedByFreelancer || contract.signedByFreelancer);

    if (willBeFullySigned) {
      updateData.status = 'ACTIVE';
      
      // Update job status
      await prisma.job.update({
        where: { id: contract.jobId },
        data: {
          status: 'IN_PROGRESS',
        },
      });
    }

    const updatedContract = await prisma.contract.update({
      where: { id },
      data: updateData,
    });

    if (willBeFullySigned) {
      // Notify both parties
      await prisma.notification.create({
        data: {
          userId: contract.clientId,
          type: 'contract_active',
          title: 'Contract Active',
          message: `Contract for "${contract.job.title}" is now active. Work can begin!`,
          data: {
            contractId: contract.id,
            jobId: contract.jobId,
          },
        },
      });

      await prisma.notification.create({
        data: {
          userId: contract.freelancerId,
          type: 'contract_active',
          title: 'Contract Active',
          message: `Contract for "${contract.job.title}" is now active. You can start working!`,
          data: {
            contractId: contract.id,
            jobId: contract.jobId,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedContract,
      message: willBeFullySigned 
        ? 'Contract signed and activated successfully' 
        : 'Contract signed successfully',
    });
  } catch (error: any) {
    console.error('Error signing contract:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
