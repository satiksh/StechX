"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const prismaClient_1 = require("./utils/prismaClient");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// CORS + basic middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Health check
app.get('/health', async (_req, res) => {
    try {
        await prismaClient_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({ ok: true });
    }
    catch {
        res.status(500).json({ ok: false });
    }
});
// Auth (Google → JWT)
app.use('/api/auth', authRoutes_1.default);
// Public API (read + submit)
app.use('/api', publicRoutes_1.default);
// Admin API (protected)
app.use('/api/admin', adminRoutes_1.default);
// 404
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});
app.listen(PORT, () => {
    console.log(`StechX v2 backend running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map