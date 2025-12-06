import { Position } from '@prisma/client';
export declare const createApplication: (position: Position, portfolioUrl: string, experience: string, talentId?: string) => Promise<{
    id: string;
    email: string;
    userId: string | null;
    name: string;
    createdAt: Date;
    serviceId: string | null;
    message: string;
    type: import(".prisma/client").$Enums.ApplicationType;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    budget: number | null;
    experience: string | null;
}>;
//# sourceMappingURL=application.service.d.ts.map