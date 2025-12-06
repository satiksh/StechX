import { z } from 'zod';
export declare const applicationSchema: z.ZodObject<{
    body: z.ZodObject<{
        talentId: z.ZodOptional<z.ZodString>;
        position: z.ZodNativeEnum<any>;
        portfolioUrl: z.ZodString;
        experience: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        [x: string]: any;
        talentId?: unknown;
        position?: unknown;
        portfolioUrl?: unknown;
        experience?: unknown;
    }, {
        [x: string]: any;
        talentId?: unknown;
        position?: unknown;
        portfolioUrl?: unknown;
        experience?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        [x: string]: any;
        talentId?: unknown;
        position?: unknown;
        portfolioUrl?: unknown;
        experience?: unknown;
    };
}, {
    body: {
        [x: string]: any;
        talentId?: unknown;
        position?: unknown;
        portfolioUrl?: unknown;
        experience?: unknown;
    };
}>;
//# sourceMappingURL=application.validator.d.ts.map