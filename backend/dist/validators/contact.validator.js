"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
exports.contactSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        projectType: zod_1.z.nativeEnum(types_1.ProjectType),
        budget: zod_1.z.number().positive('Budget must be positive'),
        message: zod_1.z.string().min(1, 'Message is required'),
    }),
});
//# sourceMappingURL=contact.validator.js.map