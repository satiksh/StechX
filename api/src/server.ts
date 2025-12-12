import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import routes
import publicRoutes from './routes/publicRoutes';
import talentRoutes from './routes/talent.routes';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobs.routes';
import proposalRoutes from './routes/proposals.routes';
import contractRoutes from './routes/contracts.routes';
import messageRoutes from './routes/messages.routes';
import reviewRoutes from './routes/reviews.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - allow frontend to connect
const corsAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://frontend-n64vxyw9e-satiksh-patels-projects.vercel.app',
  'https://stechx.vercel.app',
  'https://stechx-web.vercel.app',
]
  .concat(
    (process.env.FRONTEND_URLS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server) where Origin is not set.
      if (!origin) return callback(null, true);

      // Allow exact matches.
      if (corsAllowedOrigins.includes(origin)) return callback(null, true);

      // Allow Vercel preview deploys: https://<anything>.vercel.app
      try {
        const hostname = new URL(origin).hostname;
        if (hostname.endsWith('.vercel.app')) return callback(null, true);
      } catch {
        // ignore invalid origin
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

// Other middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'StechX Backend API is running' });
});

// Routes
app.use('/api', publicRoutes);
app.use('/api/talent', talentRoutes);
app.use('/api/auth', authRoutes);

// Compatibility aliases (some clients call auth endpoints without the /api/auth prefix)
app.post('/register', authRoutes);
app.post('/login', authRoutes);
app.post('/google', authRoutes);
app.post('/logout', authRoutes);
app.get('/me', authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for use in index.ts
export { app, PORT };
