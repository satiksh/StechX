// src/controllers/testimonialController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

export const getTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            serviceId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(testimonials);
  } catch (error: any) {
    console.error('getTestimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};
