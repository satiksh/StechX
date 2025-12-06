import { Request, Response } from 'express';
export declare const adminGetProjects: (_req: Request, res: Response) => Promise<void>;
export declare const adminGetProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminCreateProject: (req: Request, res: Response) => Promise<void>;
export declare const adminUpdateProject: (req: Request, res: Response) => Promise<void>;
export declare const adminDeleteProject: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=adminProjectController.d.ts.map