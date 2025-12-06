import { z } from 'zod';
export declare const createProjectSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    serviceId: z.ZodString;
    thumbnailUrl: z.ZodString;
    imageUrls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    summary: z.ZodString;
    caseStudy: z.ZodString;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    serviceId: string;
    thumbnailUrl: string;
    imageUrls: string[];
    summary: string;
    caseStudy: string;
    isFeatured?: boolean | undefined;
}, {
    slug: string;
    title: string;
    serviceId: string;
    thumbnailUrl: string;
    summary: string;
    caseStudy: string;
    imageUrls?: string[] | undefined;
    isFeatured?: boolean | undefined;
}>;
export declare const updateProjectSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    serviceId: z.ZodOptional<z.ZodString>;
    thumbnailUrl: z.ZodOptional<z.ZodString>;
    imageUrls: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    summary: z.ZodOptional<z.ZodString>;
    caseStudy: z.ZodOptional<z.ZodString>;
    isFeatured: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    slug?: string | undefined;
    title?: string | undefined;
    serviceId?: string | undefined;
    thumbnailUrl?: string | undefined;
    imageUrls?: string[] | undefined;
    summary?: string | undefined;
    caseStudy?: string | undefined;
    isFeatured?: boolean | undefined;
}, {
    slug?: string | undefined;
    title?: string | undefined;
    serviceId?: string | undefined;
    thumbnailUrl?: string | undefined;
    imageUrls?: string[] | undefined;
    summary?: string | undefined;
    caseStudy?: string | undefined;
    isFeatured?: boolean | undefined;
}>;
//# sourceMappingURL=adminProjectValidators.d.ts.map