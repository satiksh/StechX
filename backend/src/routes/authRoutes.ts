// src/routes/authRoutes.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../utils/prismaClient';
import { UserRole, AuthProvider } from '@prisma/client';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const JWT_SECRET = process.env.JWT_SECRET as string;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken: string) {
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

function signJwt(user: { id: string; email: string; role: UserRole }) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function handleGoogleAuth(idToken: string, role: UserRole) {
  const { email, name, sub, avatarUrl } = await verifyGoogleToken(idToken);

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    if (role === UserRole.ADMIN) {
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        throw new Error('Not allowed as admin');
      }
    }

    user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        provider: AuthProvider.GOOGLE,
        providerId: sub,
        avatarUrl,
      },
    });
  } else {
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

    const { token, user } = await handleGoogleAuth(idToken, UserRole.CLIENT);

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
  } catch (error: any) {
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

    const { token, user } = await handleGoogleAuth(idToken, UserRole.TALENT);

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
  } catch (error: any) {
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

    const { token, user } = await handleGoogleAuth(idToken, UserRole.ADMIN);

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
  } catch (error: any) {
    console.error('Google admin auth error:', error);
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
});

export default router;
