import { AuthResponse, UserRole } from '../types';
export declare const registerUser: (name: string, email: string, password: string, role: UserRole) => Promise<AuthResponse>;
export declare const loginUser: (email: string, password: string) => Promise<AuthResponse>;
//# sourceMappingURL=auth.service.d.ts.map