import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

// Create contract from proposal
export async function createContract(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { proposalId, amount, startDate, endDate, terms } = req.body;

    if (!proposalId || !amount) {
      return res.status(400).json({ error: 'Proposal ID and amount required' });
    }

    // Get proposal with job details
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { job: true, freelancer: true },
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Verify client ownership
    if (proposal.job.clientId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        jobId: proposal.jobId,
        clientId: userId,
        freelancerId: proposal.freelancerId,
        amount: parseFloat(amount),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        terms: terms || '',
        status: 'PENDING',
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        freelancer: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    });

    // Update proposal status
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'ACCEPTED' },
    });

    // Update job to in progress
    await prisma.job.update({
      where: { id: proposal.jobId },
      data: { status: 'IN_PROGRESS', assignedFreelancerId: proposal.freelancerId },
    });

    // Create notification for freelancer
    await prisma.notification.create({
      data: {
        userId: proposal.freelancerId,
        type: 'contract_created',
        title: 'Contract Created',
        message: `Contract created for "${proposal.job.title}"`,
        data: { contractId: contract.id, jobId: proposal.jobId },
      },
    });

    res.status(201).json({ data: contract, message: 'Contract created successfully' });
  } catch (error: any) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: error.message || 'Failed to create contract' });
  }
}

// Get my contracts
export async function getMyContracts(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { status, limit = 10, skip = 0 } = req.query;

    const where: any = {
      OR: [{ clientId: userId }, { freelancerId: userId }],
    };
    if (status) where.status = status;

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, avatarUrl: true, rating: true } },
        freelancer: { select: { id: true, name: true, avatarUrl: true, rating: true } },
        job: { select: { id: true, title: true } },
        payments: { select: { id: true, amount: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.contract.count({ where });

    res.json({ data: contracts, total, limit: parseInt(limit as string) || 10 });
  } catch (error: any) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch contracts' });
  }
}

// Get contract by ID
export async function getContractById(req: Request, res: Response) {
  try {
    const { contractId } = req.params;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: { select: { id: true, name: true, email: true, avatarUrl: true } },
        freelancer: { select: { id: true, name: true, email: true, avatarUrl: true } },
        job: true,
        payments: { orderBy: { createdAt: 'desc' } },
        milestones: { orderBy: { dueDate: 'asc' } },
      },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    res.json({ data: contract });
  } catch (error: any) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch contract' });
  }
}

// Update contract status
export async function updateContractStatus(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { contractId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const contract = await prisma.contract.findUnique({ where: { id: contractId } });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: {
        status,
        ...(status === 'COMPLETED' && { completionDate: new Date() }),
      },
      include: {
        client: { select: { id: true, name: true } },
        freelancer: { select: { id: true, name: true } },
        job: { select: { id: true, title: true } },
      },
    });

    // Update job status if contract completed
    if (status === 'COMPLETED') {
      await prisma.job.update({
        where: { id: contract.jobId },
        data: { status: 'COMPLETED' },
      });
    }

    res.json({ data: updated, message: 'Contract updated successfully' });
  } catch (error: any) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: error.message || 'Failed to update contract' });
  }
}

// Update project progress
export async function updateProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { contractId } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { job: true },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.freelancerId !== userId) {
      return res.status(403).json({ error: 'Only freelancer can update progress' });
    }

    // Update job progress
    const updated = await prisma.job.update({
      where: { id: contract.jobId },
      data: { progress },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: contract.clientId,
        type: 'progress_update',
        title: 'Project Progress Updated',
        message: `Project progress: ${progress}%`,
        data: { contractId, jobId: contract.jobId, progress },
      },
    });

    res.json({ data: { progress }, message: 'Progress updated' });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: error.message || 'Failed to update progress' });
  }
}
