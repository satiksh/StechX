import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

interface GoogleJWTPayload {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export async function POST(request: Request) {
  try {
    const { credential, role } = await request.json();

    // Validate role
    if (!['FREELANCER', 'AGENCY', 'CLIENT'].includes(role.toUpperCase())) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Decode Google JWT
    const decoded = jwtDecode<GoogleJWTPayload>(credential);
    
    if (!decoded.email) {
      return Response.json({ error: 'Invalid Google token' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          avatarUrl: decoded.picture || user.avatarUrl,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: decoded.name,
          email: decoded.email,
          role: role.toUpperCase(),
          provider: 'GOOGLE',
          providerId: decoded.sub,
          avatarUrl: decoded.picture,
          isVerified: true, // Auto-verify Google users
        },
      });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return Response.json({ error: 'Account is suspended' }, { status: 403 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return Response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
