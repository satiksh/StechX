import { NextFunction, Request, Response } from 'express';
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
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authorizeRole: (role: UserRole) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authMiddleware.d.ts.map