"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const prismaClient_1 = require("../utils/prismaClient");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
async function verifyGoogleToken(idToken) {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
        throw new Error('Invalid Google token payload');
    }
    return {
        email: payload.email,
        name: payload.name || '',
        sub: payload.sub,
        avatarUrl: payload.picture || undefined,
    };
}
function signJwt(user) {
    return jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
    }, JWT_SECRET, { expiresIn: '7d' });
}
async function handleGoogleAuth(idToken, role) {
    const { email, name, sub, avatarUrl } = await verifyGoogleToken(idToken);
    let user = await prismaClient_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        if (role === client_1.UserRole.ADMIN) {
            if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
                throw new Error('Not allowed as admin');
            }
        }
        user = await prismaClient_1.prisma.user.create({
            data: {
                email,
                name,
                role,
                provider: client_1.AuthProvider.GOOGLE,
                providerId: sub,
                avatarUrl,
            },
        });
    }
    else {
        if (user.role !== role) {
            throw new Error('Role mismatch for this account');
        }
    }
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return { token, user };
}
// POST /api/auth/google/client
router.post('/google/client', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'idToken is required' });
        }
        const { token, user } = await handleGoogleAuth(idToken, client_1.UserRole.CLIENT);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        });
    }
    catch (error) {
        console.error('Google client auth error:', error);
        res.status(401).json({ error: error.message || 'Authentication failed' });
    }
});
// POST /api/auth/google/talent
router.post('/google/talent', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'idToken is required' });
        }
        const { token, user } = await handleGoogleAuth(idToken, client_1.UserRole.TALENT);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        });
    }
    catch (error) {
        console.error('Google talent auth error:', error);
        res.status(401).json({ error: error.message || 'Authentication failed' });
    }
});
// POST /api/auth/google/admin
router.post('/google/admin', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'idToken is required' });
        }
        const { token, user } = await handleGoogleAuth(idToken, client_1.UserRole.ADMIN);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        });
    }
    catch (error) {
        console.error('Google admin auth error:', error);
        res.status(401).json({ error: error.message || 'Authentication failed' });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map