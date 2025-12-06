"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
const registerUser = async (name, email, password, role) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new errorHandler_1.AppError(409, 'User already exists');
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role,
            country: 'India',
            skills: [],
        },
    });
    const jwt = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            country: user.country,
            portfolioUrl: user.portfolioUrl || undefined,
            skills: user.skills,
        },
        jwt,
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new errorHandler_1.AppError(401, 'Invalid email or password');
    }
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new errorHandler_1.AppError(401, 'Invalid email or password');
    }
    const jwt = (0, jwt_1.generateToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            country: user.country,
            portfolioUrl: user.portfolioUrl || undefined,
            skills: user.skills,
        },
        jwt,
    };
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.service.js.map