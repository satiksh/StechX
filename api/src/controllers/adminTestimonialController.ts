// src/controllers/adminTestimonialController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from '../validators/adminTestimonialValidators';

export const adminGetTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(testimonials);
  } catch (error: any) {
    console.error('adminGetTestimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

export const adminCreateTestimonial = async (req: Request, res: Response) => {
  try {
    const data = createTestimonialSchema.parse(req.body);

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: data.clientName,
        clientRole: data.clientRole,
        quote: data.quote,
        projectId: data.projectId ?? null,
      },
    });

    res.status(201).json(testimonial);
  } catch (error: any) {
    console.error('adminCreateTestimonial error:', error);
    res.status(400).json({ error: error.message || 'Failed to create testimonial' });
  }
};

export const adminUpdateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateTestimonialSchema.parse(req.body);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    res.status(200).json(testimonial);
  } catch (error: any) {
    console.error('adminUpdateTestimonial error:', error);
    res.status(400).json({ error: error.message || 'Failed to update testimonial' });
  }
};

export const adminDeleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('adminDeleteTestimonial error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete testimonial' });
  }
};
