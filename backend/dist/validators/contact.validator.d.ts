import { z } from 'zod';
export declare const contactSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        projectType: z.ZodNativeEnum<any>;
        budget: z.ZodNumber;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        projectType?: unknown;
        budget?: unknown;
        message?: unknown;
    }, {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        projectType?: unknown;
        budget?: unknown;
        message?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        projectType?: unknown;
        budget?: unknown;
        message?: unknown;
    };
}, {
    body: {
        [x: string]: any;
        name?: unknown;
        email?: unknown;
        projectType?: unknown;
        budget?: unknown;
        message?: unknown;
    };
}>;
//# sourceMappingURL=contact.validator.d.ts.map