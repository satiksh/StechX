import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/api/projects',
  '/api/bids',
  '/api/contracts',
  '/api/admin',
];

// Routes accessible to specific roles only
const roleRoutes: { [key: string]: string[] } = {
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/client': ['CLIENT'],
  '/dashboard/freelancer': ['FREELANCER', 'AGENCY'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected) {
    // Get token from Authorization header or cookies
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // Check role-based access
      const roleRoute = Object.entries(roleRoutes).find(([route]) => pathname.startsWith(route));
      if (roleRoute) {
        const [, allowedRoles] = roleRoute;
        if (!allowedRoles.includes(decoded.role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Add user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
