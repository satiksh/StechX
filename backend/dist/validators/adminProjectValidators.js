"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
// src/validators/adminProjectValidators.ts
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    serviceId: zod_1.z.string().uuid(),
    thumbnailUrl: zod_1.z.string().url(),
    imageUrls: zod_1.z.array(zod_1.z.string().url()).default([]),
    summary: zod_1.z.string().min(1),
    caseStudy: zod_1.z.string().min(1),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
//# sourceMappingURL=adminProjectValidators.js.map