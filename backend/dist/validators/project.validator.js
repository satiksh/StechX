"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
exports.createProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        clientId: zod_1.z.string().uuid('Invalid client ID'),
        project: zod_1.z.object({
            title: zod_1.z.string().min(1, 'Title is required'),
            description: zod_1.z.string().min(1, 'Description is required'),
            type: zod_1.z.nativeEnum(types_1.ProjectType),
            budget: zod_1.z.number().positive('Budget must be positive'),
            attachments: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
        }),
    }),
});
//# sourceMappingURL=project.validator.js.map