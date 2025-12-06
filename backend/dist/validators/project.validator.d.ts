import { z } from 'zod';
export declare const createProjectSchema: z.ZodObject<{
    body: z.ZodObject<{
        clientId: z.ZodString;
        project: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            type: z.ZodNativeEnum<any>;
            budget: z.ZodNumber;
            attachments: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            [x: string]: any;
            title?: unknown;
            description?: unknown;
            type?: unknown;
            budget?: unknown;
            attachments?: unknown;
        }, {
            [x: string]: any;
            title?: unknown;
            description?: unknown;
            type?: unknown;
            budget?: unknown;
            attachments?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        project: {
            [x: string]: any;
            title?: unknown;
            description?: unknown;
            type?: unknown;
            budget?: unknown;
            attachments?: unknown;
        };
        clientId: string;
    }, {
        project: {
            [x: string]: any;
            title?: unknown;
            description?: unknown;
            type?: unknown;
            budget?: unknown;
            attachments?: unknown;
        };
        clientId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        project: {
            [x: string]: any;
            title?: unknown;
            description?: unknown;
            type?: unknown;
            budget?: unknown;
            attachments?: unknown;
        };
        clientId: string;
    };
}, {
    body: {
        project: {
            [x: string]: any;
            title?: unknown;
            description?: unknown;
            type?: unknown;
            budget?: unknown;
            attachments?: unknown;
        };
        clientId: string;
    };
}>;
//# sourceMappingURL=project.validator.d.ts.map