import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

// Get current user profile
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        portfolioUrl: true,
        isVerified: true,
        rating: true,
        totalReviews: true,
        totalEarnings: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ data: user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
}

// Get user by ID (public profile)
export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        portfolioUrl: true,
        isVerified: true,
        rating: true,
        totalReviews: true,
        totalEarnings: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ data: user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
}

// Update user profile
export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const { name, bio, skills, hourlyRate, portfolioUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(skills && { skills }),
        ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
        ...(portfolioUrl && { portfolioUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        portfolioUrl: true,
        isVerified: true,
        rating: true,
        totalReviews: true,
      },
    });

    res.json({ data: user, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
}

// Get dashboard stats
export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, totalEarnings: true, rating: true, totalReviews: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let stats: any = {
      rating: user.rating,
      totalReviews: user.totalReviews,
      totalEarnings: user.totalEarnings,
    };

    if (user.role === 'CLIENT') {
      // Client stats
      const myJobs = await prisma.job.findMany({ where: { clientId: userId } });
      const activeJobs = myJobs.filter((j: any) => j.status === 'OPEN' || j.status === 'IN_PROGRESS').length;
      const totalSpent = myJobs.reduce((sum: number, j: any) => sum + j.budget, 0);
      const contracts = await prisma.contract.findMany({
        where: { clientId: userId },
      });
      const activeFreelancers = new Set(contracts.map((c: any) => c.freelancerId)).size;

      stats = {
        ...stats,
        activeProjects: activeJobs,
        totalSpent,
        activeFreelancers,
        totalContracts: contracts.length,
      };
    } else if (user.role === 'TALENT') {
      // Freelancer stats
      const myProposals = await prisma.proposal.findMany({ where: { freelancerId: userId } });
      const acceptedProposals = myProposals.filter((p: any) => p.status === 'ACCEPTED').length;
      const contracts = await prisma.contract.findMany({ where: { freelancerId: userId } });
      const activeContracts = contracts.filter((c: any) => c.status === 'ACTIVE').length;

      stats = {
        ...stats,
        activeProjects: activeContracts,
        totalProposals: myProposals.length,
        acceptedProposals,
        totalContracts: contracts.length,
        totalEarnings: user.totalEarnings,
      };
    }

    res.json({ data: stats });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch stats' });
  }
}
