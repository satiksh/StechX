import { z } from 'zod';
export declare const createTestimonialSchema: z.ZodObject<{
    clientName: z.ZodString;
    clientRole: z.ZodString;
    quote: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    clientName: string;
    clientRole: string;
    quote: string;
    projectId?: string | undefined;
}, {
    clientName: string;
    clientRole: string;
    quote: string;
    projectId?: string | undefined;
}>;
export declare const updateTestimonialSchema: z.ZodObject<{
    clientName: z.ZodOptional<z.ZodString>;
    clientRole: z.ZodOptional<z.ZodString>;
    quote: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    projectId?: string | undefined;
    clientName?: string | undefined;
    clientRole?: string | undefined;
    quote?: string | undefined;
}, {
    projectId?: string | undefined;
    clientName?: string | undefined;
    clientRole?: string | undefined;
    quote?: string | undefined;
}>;
//# sourceMappingURL=adminTestimonialValidators.d.ts.map