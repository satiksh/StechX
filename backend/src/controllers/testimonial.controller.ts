import { Request, Response, NextFunction } from 'express';
import { getAllTestimonials } from '../services/testimonial.service';

export const getTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllTestimonials();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
