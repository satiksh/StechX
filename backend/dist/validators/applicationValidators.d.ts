import { z } from 'zod';
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    message: string;
}, {
    email: string;
    name: string;
    message: string;
}>;
export declare const clientApplicationSchema: z.ZodObject<{
    serviceId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    message: z.ZodString;
    budget: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    message: string;
    serviceId?: string | undefined;
    budget?: number | undefined;
}, {
    email: string;
    name: string;
    message: string;
    serviceId?: string | undefined;
    budget?: number | undefined;
}>;
export declare const talentApplicationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    message: z.ZodString;
    experience: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    message: string;
    experience?: string | undefined;
}, {
    email: string;
    name: string;
    message: string;
    experience?: string | undefined;
}>;
//# sourceMappingURL=applicationValidators.d.ts.map