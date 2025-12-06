"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.talentApplicationSchema = exports.clientApplicationSchema = exports.contactSchema = void 0;
// src/validators/applicationValidators.ts
const zod_1 = require("zod");
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    message: zod_1.z.string().min(1),
});
exports.clientApplicationSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid().optional(), // optional per contract
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    message: zod_1.z.string().min(1),
    budget: zod_1.z.number().positive().optional(),
});
exports.talentApplicationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    message: zod_1.z.string().min(1),
    experience: zod_1.z.string().min(1).optional(),
});
//# sourceMappingURL=applicationValidators.js.map