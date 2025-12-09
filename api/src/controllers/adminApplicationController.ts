// src/controllers/adminApplicationController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { ApplicationStatus } from '@prisma/client';
import { z } from 'zod';

const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export const adminGetApplications = async (_req: Request, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(applications);
  } catch (error: any) {
    console.error('adminGetApplications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const adminUpdateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateApplicationStatusSchema.parse(req.body);

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: data.status,
      },
    });

    res.status(200).json(application);
  } catch (error: any) {
    console.error('adminUpdateApplicationStatus error:', error);
    res.status(400).json({ error: error.message || 'Failed to update application status' });
  }
};
