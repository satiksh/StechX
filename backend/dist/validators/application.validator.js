"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
exports.applicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // talentId is optional for public applications (can be attached later after auth)
        talentId: zod_1.z.string().uuid().optional(),
        position: zod_1.z.nativeEnum(types_1.Position),
        portfolioUrl: zod_1.z.string().url('Invalid portfolio URL'),
        experience: zod_1.z.string().min(10, 'Please tell us a bit more about your experience'),
    }),
});
//# sourceMappingURL=application.validator.js.map