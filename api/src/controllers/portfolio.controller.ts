import { Request, Response, NextFunction } from 'express';
import { getPortfolioProjects } from '../services/project.service';

export const getPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getPortfolioProjects();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
