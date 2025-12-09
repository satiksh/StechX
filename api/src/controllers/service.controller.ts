import { Request, Response, NextFunction } from 'express';
import { getAllServices } from '../services/service.service';

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllServices();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
