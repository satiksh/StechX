import { ProjectType } from '@prisma/client';
export declare const createContactRequest: (data: {
    name: string;
    email: string;
    projectType: ProjectType;
    budget: number;
    message: string;
}) => Promise<{
    contactRequestId: any;
}>;
//# sourceMappingURL=contact.service.d.ts.map