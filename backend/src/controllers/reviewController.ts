import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

// Leave a review
export async function leaveReview(req: Request, res: Response) {
  try {
    const reviewerId = (req as any).userId;
    const { contractId, revieweeId, rating, comment } = req.body;

    if (!revieweeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) and reviewee ID required' });
    }

    // Check if contract exists if provided
    if (contractId) {
      const contract = await prisma.contract.findUnique({ where: { id: contractId } });
      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }
    }

    const review = await prisma.review.create({
      data: {
        contractId: contractId || null,
        reviewerId,
        revieweeId,
        rating,
        comment: comment || null,
      },
    });

    // Update reviewer average rating
    const reviews = await prisma.review.findMany({ where: { revieweeId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.user.update({
      where: { id: revieweeId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        totalReviews: reviews.length,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: revieweeId,
        type: 'review',
        title: 'New Review',
        message: `You received a ${rating}-star review`,
        data: { contractId },
      },
    });

    res.status(201).json({ data: review, message: 'Review posted' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already reviewed this contract' });
    }
    console.error('Error leaving review:', error);
    res.status(500).json({ error: error.message || 'Failed to post review' });
  }
}

// Get reviews for a user
export async function getUserReviews(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    const total = await prisma.review.count({ where: { revieweeId: userId } });

    res.json({ data: reviews, total });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
  }
}

// Get all my reviews (as reviewer)
export async function getMyReviews(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { limit = 10, skip = 0 } = req.query;

    const reviews = await prisma.review.findMany({
      where: { reviewerId: userId },
      include: {
        reviewee: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 10,
      skip: parseInt(skip as string) || 0,
    });

    res.json({ data: reviews });
  } catch (error: any) {
    console.error('Error fetching my reviews:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
  }
}
