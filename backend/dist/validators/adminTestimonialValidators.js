"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialSchema = exports.createTestimonialSchema = void 0;
// src/validators/adminTestimonialValidators.ts
const zod_1 = require("zod");
exports.createTestimonialSchema = zod_1.z.object({
    clientName: zod_1.z.string().min(1),
    clientRole: zod_1.z.string().min(1),
    quote: zod_1.z.string().min(1),
    projectId: zod_1.z.string().uuid().optional(),
});
exports.updateTestimonialSchema = exports.createTestimonialSchema.partial();
//# sourceMappingURL=adminTestimonialValidators.js.map