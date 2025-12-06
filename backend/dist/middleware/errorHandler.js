"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const logger_1 = require("./logger");
class AppError extends Error {
    constructor(statusCode, message, fields) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.fields = fields;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    if (err instanceof AppError) {
        const response = {
            code: err.statusCode,
            message: err.message,
            ...(err.fields && { fields: err.fields }),
        };
        return res.status(err.statusCode).json(response);
    }
    if (err instanceof zod_1.ZodError) {
        const fields = {};
        err.errors.forEach((error) => {
            const path = error.path.join('.');
            fields[path] = error.message;
        });
        const response = {
            code: 400,
            message: 'Invalid request data',
            fields,
        };
        return res.status(400).json(response);
    }
    const response = {
        code: 500,
        message: 'Internal Server Error',
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map