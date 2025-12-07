import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { authenticateToken } from '../middleware/auth';

// Create a new job
export async function createJob(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { title, description, category, requiredSkills, budget, budgetType, deadline, isUrgent } = req.body;

    if (!title || !description || !category || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        category,
        requiredSkills: requiredSkills || [],
        budget: parseFloat(budget),
        budgetType: budgetType || 'fixed',
        deadline: deadline ? new Date(deadline) : null,
        isUrgent: isUrgent || false,
        clientId: userId,
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json({ data: job, message: 'Job created successfully' });
  } catch (error: any) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: error.message || 'Failed to create job' });
  }
}

// Get all jobs (with filtering)
export async function getAllJobs(req: Request, res: Response) {
  try {
    const { category, minBudget, maxBudget, skills, search, status, limit = 10, skip = 0 } = req.query;

    const where: any = { status: 'OPEN' };

    if (category) where.category = category;
    if (minBudget) where.budget = { gte: parseFloat(minBudget as string) };
    if (maxBudget) {
      where.budget = where.budget ? { ...where.budget, lte: parseFloat(maxBudget as string) } : { lte: parseFloat(maxBudget as string) };
    }
    if (skills) {
      const skillsArray = (skills as string).split(',');
      where.requiredSkills = { hasSome: skillsArray };
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, avatarUrl: true, rating: true },
        },
        proposals: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.job.count({ where });

    res.json({
      data: jobs,
      total,
      limit: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch jobs' });
  }
}

// Get my jobs (client)
export async function getMyJobs(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { status, limit = 10, skip = 0 } = req.query;

    const where: any = { clientId: userId };
    if (status) where.status = status;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        proposals: { select: { id: true, freelancer: { select: { id: true, name: true, rating: true } } } },
        contract: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.job.count({ where });

    res.json({ data: jobs, total, limit: parseInt(limit as string) || 10, skip: parseInt(skip as string) || 0 });
  } catch (error: any) {
    console.error('Error fetching my jobs:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch jobs' });
  }
}

// Get single job
export async function getJobById(req: Request, res: Response) {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: {
          select: { id: true, name: true, email: true, avatarUrl: true, bio: true, rating: true, totalReviews: true },
        },
        proposals: {
          include: {
            freelancer: { select: { id: true, name: true, rating: true, skills: true, totalEarnings: true } },
          },
        },
        contract: {
          include: {
            freelancer: { select: { id: true, name: true, email: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ data: job });
  } catch (error: any) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch job' });
  }
}

// Update job
export async function updateJob(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { jobId } = req.params;
    const { title, description, category, requiredSkills, budget, deadline, status, progress } = req.body;

    // Check ownership
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.clientId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(requiredSkills && { requiredSkills }),
        ...(budget && { budget: parseFloat(budget) }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
      },
      include: {
        client: { select: { id: true, name: true } },
        proposals: { select: { id: true } },
      },
    });

    res.json({ data: updated, message: 'Job updated successfully' });
  } catch (error: any) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: error.message || 'Failed to update job' });
  }
}

// Delete job
export async function deleteJob(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { jobId } = req.params;

    // Check ownership
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.clientId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await prisma.job.delete({ where: { id: jobId } });

    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: error.message || 'Failed to delete job' });
  }
}

// Bookmark a job
export async function bookmarkJob(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID required' });
    }

    const bookmark = await prisma.bookmarkedJob.create({
      data: { userId, jobId },
    });

    res.status(201).json({ data: bookmark, message: 'Job bookmarked' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already bookmarked' });
    }
    console.error('Error bookmarking job:', error);
    res.status(500).json({ error: error.message || 'Failed to bookmark job' });
  }
}

// Unbookmark a job
export async function unbookmarkJob(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { jobId } = req.params;

    await prisma.bookmarkedJob.deleteMany({
      where: { userId, jobId },
    });

    res.json({ message: 'Job unbookmarked' });
  } catch (error: any) {
    console.error('Error unbookmarking job:', error);
    res.status(500).json({ error: error.message || 'Failed to unbookmark job' });
  }
}

// Get bookmarked jobs
export async function getBookmarkedJobs(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { limit = 10, skip = 0 } = req.query;

    const bookmarks = await prisma.bookmarkedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            client: { select: { id: true, name: true, rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.bookmarkedJob.count({ where: { userId } });

    res.json({
      data: bookmarks.map(b => b.job),
      total,
      limit: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });
  } catch (error: any) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bookmarks' });
  }
}
