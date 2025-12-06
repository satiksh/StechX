import { ProjectType } from '@prisma/client';
export declare const getPortfolioProjects: () => Promise<{
    projects: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        serviceId: string;
        thumbnailUrl: string;
        imageUrls: string[];
        summary: string;
        caseStudy: string;
        isFeatured: boolean;
    }[];
}>;
export declare const createProject: (clientId: string, projectData: {
    title: string;
    description: string;
    type: ProjectType;
    budget: number;
    attachments?: string[];
}) => Promise<{
    projectId: string;
}>;
export declare const getClientProjects: (clientId: string) => Promise<{
    projects: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        serviceId: string;
        thumbnailUrl: string;
        imageUrls: string[];
        summary: string;
        caseStudy: string;
        isFeatured: boolean;
    }[];
}>;
//# sourceMappingURL=project.service.d.ts.map