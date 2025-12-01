import { Request, Response, NextFunction } from 'express';
import { createApplication } from '../services/application.service';
import { Position } from '@prisma/client';

export const applyAsTalent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { position, portfolioUrl, experience } = req.body;

    const application = await createApplication(
      position as Position,
      portfolioUrl,
      experience
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getTalentProfileController = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(200).json({ message: 'Talent profile placeholder' });
};
