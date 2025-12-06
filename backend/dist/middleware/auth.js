"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("./errorHandler");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errorHandler_1.AppError(401, 'Unauthorized: Missing or invalid JWT.');
        }
        const token = authHeader.substring(7);
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        next(new errorHandler_1.AppError(401, 'Unauthorized: Missing or invalid JWT.'));
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError(401, 'Unauthorized: Missing or invalid JWT.'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError(403, 'Forbidden'));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.js.map