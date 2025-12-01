import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger';
import { ApiError } from '../types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    const response: ApiError = {
      code: err.statusCode,
      message: err.message,
      ...(err.fields && { fields: err.fields }),
    };
    return res.status(err.statusCode).json(response);
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    err.errors.forEach((error) => {
      const path = error.path.join('.');
      fields[path] = error.message;
    });
    const response: ApiError = {
      code: 400,
      message: 'Invalid request data',
      fields,
    };
    return res.status(400).json(response);
  }

  const response: ApiError = {
    code: 500,
    message: 'Internal Server Error',
  };
  res.status(500).json(response);
};
