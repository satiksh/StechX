import { UserRole, ProjectType, ProjectStatus, Position, ApplicationStatus } from '@prisma/client';
export { UserRole, ProjectType, ProjectStatus, Position, ApplicationStatus };
export interface ApiError {
    code: number;
    message: string;
    fields?: Record<string, string>;
}
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}
export interface AuthResponse {
    user: {
        id: string;
        role: UserRole;
        name: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        country: string;
        portfolioUrl?: string;
        skills: string[];
    };
    jwt: string;
}
//# sourceMappingURL=index.d.ts.map