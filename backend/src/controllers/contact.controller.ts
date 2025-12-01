import { Request, Response, NextFunction } from 'express';
import { createContactRequest } from '../services/contact.service';

export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, projectType, budget, message } = req.body;
    const result = await createContactRequest({
      name,
      email,
      projectType,
      budget,
      message,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
