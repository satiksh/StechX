import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { JwtPayload, UserRole } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    let token: string | undefined;

    // Prefer Authorization header but fall back to signed cookie for browser requests
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if ((req as any).cookies?.token) {
      token = (req as any).cookies.token;
    }

    if (!token) {
      throw new AppError(401, 'Unauthorized: Missing or invalid JWT.');
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new AppError(401, 'Unauthorized: Missing or invalid JWT.'));
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized: Missing or invalid JWT.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden'));
    }

    next();
  };
};
