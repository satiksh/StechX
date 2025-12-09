// src/controllers/applicationController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import { ApplicationType, ApplicationStatus } from '@prisma/client';
import { contactSchema, clientApplicationSchema, talentApplicationSchema } from '../validators/applicationValidators';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const data = contactSchema.parse(req.body);

    // Represent a general contact as an Application with type CLIENT_PROJECT but without serviceId/budget/experience.
    const application = await prisma.application.create({
      data: {
        type: ApplicationType.CLIENT_PROJECT,
        name: data.name,
        email: data.email,
        message: data.message,
        status: ApplicationStatus.SUBMITTED,
      },
    });

    res.status(201).json({ ok: true, applicationId: application.id });
  } catch (error: any) {
    console.error('submitContact error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit contact' });
  }
};

export const applyClient = async (req: Request, res: Response) => {
  try {
    const data = clientApplicationSchema.parse(req.body);

    const application = await prisma.application.create({
      data: {
        type: ApplicationType.CLIENT_PROJECT,
        serviceId: data.serviceId ?? null,
        name: data.name,
        email: data.email,
        message: data.message,
        budget: data.budget ?? null,
        status: ApplicationStatus.SUBMITTED,
      },
    });

    res.status(201).json({ ok: true, applicationId: application.id });
  } catch (error: any) {
    console.error('applyClient error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit client application' });
  }
};

export const applyTalent = async (req: Request, res: Response) => {
  try {
    const data = talentApplicationSchema.parse(req.body);

    const application = await prisma.application.create({
      data: {
        type: ApplicationType.TALENT,
        name: data.name,
        email: data.email,
        message: data.message,
        experience: data.experience ?? null,
        status: ApplicationStatus.SUBMITTED,
      },
    });

    res.status(201).json({ ok: true, applicationId: application.id });
  } catch (error: any) {
    console.error('applyTalent error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit talent application' });
  }
};
