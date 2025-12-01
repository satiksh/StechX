import { Request, Response, NextFunction } from 'express';
import { createApplication, getTalentProfile } from '../services/application.service';

export const applyAsTalent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { talentId, position, portfolioUrl, experience } = req.body;
    const result = await createApplication(talentId, position, portfolioUrl, experience);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTalentProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { talentId } = req.query;
    const result = await getTalentProfile(talentId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
