"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
// src/middleware/validateRequest.ts
const zod_1 = require("zod");
const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                issues: error.errors,
            });
        }
        return res.status(400).json({ error: 'Invalid request body' });
    }
};
exports.validateBody = validateBody;
//# sourceMappingURL=validateRequest.js.map