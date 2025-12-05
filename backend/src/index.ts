// src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { prisma } from './utils/prismaClient';
import authRoutes from './routes/authRoutes';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// DEBUG: log which DB the server is really using
console.log('### RUNTIME DATABASE_URL:', process.env.DATABASE_URL);

// CORS + basic middleware
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// Auth (Google → JWT)
app.use('/api/auth', authRoutes);

// Public API (read + submit)
app.use('/api', publicRoutes);

// Admin API (protected)
app.use('/api/admin', adminRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  }
);

app.listen(PORT, () => {
  console.log(`StechX v2 backend running on http://localhost:${PORT}`);
});
