export declare const getAllUsers: () => Promise<{
    id: string;
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    name: string;
    avatarUrl: string | null;
    provider: import(".prisma/client").$Enums.AuthProvider;
    providerId: string | null;
    passwordHash: string | null;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare const getAllProjects: () => Promise<{
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
}[]>;
export declare const getAllApplications: () => Promise<{
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
}[]>;
//# sourceMappingURL=user.service.d.ts.map