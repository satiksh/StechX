// src/middleware/validateRequest.ts
import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validateBody =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: error.errors,
        });
      }

      return res.status(400).json({ error: 'Invalid request body' });
    }
  };
