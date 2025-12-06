import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
export declare const validateBody: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validateRequest.d.ts.map