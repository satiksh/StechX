import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodEnum<any>;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        password?: unknown;
        role?: unknown;
    }, {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        password?: unknown;
        role?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        password?: unknown;
        role?: unknown;
    };
}, {
    body: {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        password?: unknown;
        role?: unknown;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
//# sourceMappingURL=auth.validator.d.ts.map