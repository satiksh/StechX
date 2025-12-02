// src/middleware/authMiddleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Auth middleware will not work correctly.');
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    const tokenFromCookie = (req as any).cookies?.token as string | undefined;

    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;

    return next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }

    return next();
  };
};
