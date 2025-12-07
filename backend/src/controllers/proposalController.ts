import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

// Submit a proposal
export async function submitProposal(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { jobId, coverLetter, proposedBudget, estimatedDays, attachments } = req.body;

    if (!jobId || !coverLetter) {
      return res.status(400).json({ error: 'Job ID and cover letter required' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already proposed
    const existing = await prisma.proposal.findUnique({
      where: { jobId_freelancerId: { jobId, freelancerId: userId } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Already submitted a proposal for this job' });
    }

    const proposal = await prisma.proposal.create({
      data: {
        jobId,
        freelancerId: userId,
        coverLetter,
        proposedBudget: proposedBudget ? parseFloat(proposedBudget) : null,
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : null,
        attachments: attachments || [],
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: {
        freelancer: { select: { id: true, name: true, rating: true, skills: true } },
        job: { select: { id: true, title: true, budget: true, clientId: true } },
      },
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        userId: job.clientId,
        type: 'proposal',
        title: 'New Proposal Received',
        message: `${proposal.freelancer.name} submitted a proposal for "${proposal.job.title}"`,
        data: { jobId, proposalId: proposal.id },
      },
    });

    res.status(201).json({ data: proposal, message: 'Proposal submitted successfully' });
  } catch (error: any) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({ error: error.message || 'Failed to submit proposal' });
  }
}

// Get proposals for a job
export async function getJobProposals(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    const { limit = 10, skip = 0, status } = req.query;

    const where: any = { jobId };
    if (status) where.status = status;

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            rating: true,
            skills: true,
            totalEarnings: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.proposal.count({ where });

    res.json({
      data: proposals,
      total,
      limit: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch proposals' });
  }
}

// Get my proposals (freelancer)
export async function getMyProposals(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { status, limit = 10, skip = 0 } = req.query;

    const where: any = { freelancerId: userId };
    if (status) where.status = status;

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        job: {
          include: {
            client: { select: { id: true, name: true, rating: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.proposal.count({ where });

    res.json({
      data: proposals,
      total,
      limit: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });
  } catch (error: any) {
    console.error('Error fetching my proposals:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch proposals' });
  }
}

// Update proposal status
export async function updateProposalStatus(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { proposalId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    // Verify ownership through job
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { job: true },
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (proposal.job.clientId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this proposal' });
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
      include: {
        freelancer: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    });

    // Create notification for freelancer
    if (status === 'ACCEPTED') {
      await prisma.notification.create({
        data: {
          userId: proposal.freelancerId,
          type: 'proposal_accepted',
          title: 'Proposal Accepted!',
          message: `Your proposal for "${updated.job.title}" has been accepted!`,
          data: { jobId: updated.job.id, proposalId: updated.id },
        },
      });
    } else if (status === 'REJECTED') {
      await prisma.notification.create({
        data: {
          userId: proposal.freelancerId,
          type: 'proposal_rejected',
          title: 'Proposal Rejected',
          message: `Your proposal for "${updated.job.title}" has been rejected.`,
          data: { jobId: updated.job.id },
        },
      });
    }

    res.json({ data: updated, message: 'Proposal updated successfully' });
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ error: error.message || 'Failed to update proposal' });
  }
}

// Withdraw proposal
export async function withdrawProposal(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { proposalId } = req.params;

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });

    if (!proposal || proposal.freelancerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to withdraw this proposal' });
    }

    if (proposal.status !== 'DRAFT' && proposal.status !== 'SUBMITTED') {
      return res.status(400).json({ error: 'Cannot withdraw proposal in current status' });
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'WITHDRAWN' },
    });

    res.json({ data: updated, message: 'Proposal withdrawn' });
  } catch (error: any) {
    console.error('Error withdrawing proposal:', error);
    res.status(500).json({ error: error.message || 'Failed to withdraw proposal' });
  }
}
