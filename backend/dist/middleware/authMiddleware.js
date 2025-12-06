"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('JWT_SECRET is not set. Auth middleware will not work correctly.');
}
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : undefined;
        const tokenFromCookie = req.cookies?.token;
        const token = tokenFromHeader || tokenFromCookie;
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        return next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=authMiddleware.js.map