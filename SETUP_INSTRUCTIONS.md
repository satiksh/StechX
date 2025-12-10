# STech-X Platform - Installation & Setup Instructions

## 🚀 Quick Start Guide

### 1. Install Required Dependencies

#### Web Frontend Dependencies
```bash
cd web
npm install @prisma/client bcryptjs jsonwebtoken jwt-decode @react-oauth/google
npm install -D @types/bcryptjs @types/jsonwebtoken prisma
```

#### API Backend Dependencies (if using separate API)
```bash
cd api
npm install @prisma/client bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken prisma
```

### 2. Copy Assets

Copy the logo and founder photo to the public directory:
```bash
# From your project root
cp /Users/satikshpatel/Desktop/agency/stxlogo.png web/public/images/
cp /Users/satikshpatel/Desktop/agency/satiksh.jpeg web/public/images/
```

Or manually:
1. Navigate to `/Users/satikshpatel/Desktop/agency/`
2. Copy `stxlogo.png` and `satiksh.jpeg`
3. Paste into `/Users/satikshpatel/stechx/web/public/images/`

### 3. Setup Environment Variables

Create a `.env` file in the `web` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stechx?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 4. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Application type: "Web application"
6. Authorized JavaScript origins: `http://localhost:3000`
7. Authorized redirect URIs: `http://localhost:3000`
8. Copy the Client ID and Client Secret to your `.env` file

### 5. Update Web Layout to Use New Navbar

Edit `/web/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "STech-X",
  description: "Transparent Marketplace for Technology Services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <EnhancedNavbar />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### 6. Database Setup

```bash
# Generate Prisma Client
cd web  # or wherever your schema.prisma is
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

### 7. Create Prisma Client Instance

Create `/web/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Then update all API routes to use this instead of creating new instances:

```typescript
import { prisma } from '@/lib/prisma';
```

### 8. Run Development Server

```bash
cd web
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
stechx/
├── web/                          # Next.js frontend
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── about/           # ✅ Founder page
│   │   │   ├── services/
│   │   │   └── contact/
│   │   ├── api/
│   │   │   └── auth/            # ✅ Auth endpoints
│   │   │       ├── signup/
│   │   │       ├── signin/
│   │   │       └── google/
│   │   ├── dashboard/
│   │   │   ├── client/          # 🔧 Client dashboard
│   │   │   ├── freelancer/      # 🔧 Freelancer dashboard
│   │   │   └── admin/           # 🔧 Admin dashboard
│   │   └── layout.tsx
│   ├── components/
│   │   └── EnhancedNavbar.tsx   # ✅ Main navigation
│   ├── lib/
│   │   └── prisma.ts            # Prisma client instance
│   └── public/
│       └── images/
│           ├── stxlogo.png      # ⚠️ Copy from Desktop
│           └── satiksh.jpeg     # ⚠️ Copy from Desktop
├── db/
│   └── schema.prisma            # ✅ Complete database schema
└── IMPLEMENTATION_GUIDE.md      # ✅ Complete guide

Legend:
✅ Complete
🔧 Needs implementation
⚠️ Manual action required
```

## 🎯 Features Implemented

### ✅ Completed
1. **Database Schema** - Complete with all models for bidding, contracts, payments
2. **Enhanced Navbar** - Role-based auth with Google OAuth
3. **About/Founder Page** - Satiksh Patel profile with social links
4. **Auth API Routes** - Signup, Signin, Google OAuth
5. **Implementation Guide** - Complete documentation

### 🔧 To Implement
1. **Client Dashboard** - Project creation, bid management, contracts
2. **Freelancer Dashboard** - Browse projects, submit bids, manage work
3. **Admin Dashboard** - User management, contract creation, payment oversight
4. **Bidding System** - Live bidding, 24-hour periods, automatic winner selection
5. **Contract Management** - Digital signatures, escrow, milestones
6. **Payment System** - Stripe integration, escrow handling
7. **Notification System** - Email/in-app notifications
8. **Google Meet Integration** - Schedule meetings for contract discussions

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Setup proper CORS policies
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting on API routes
- [ ] Add input validation with Zod or similar
- [ ] Setup proper error logging (Sentry, LogRocket)
- [ ] Implement CSRF protection
- [ ] Add security headers (helmet.js)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 📦 Deployment

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel login
vercel
```

### Environment Variables on Vercel
Add all environment variables from `.env` to your Vercel project settings.

### Database
- Use a managed PostgreSQL service (Neon, Supabase, Railway)
- Update DATABASE_URL in production environment

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Module not found: Can't resolve 'bcryptjs'"
```bash
npm install bcryptjs @types/bcryptjs
```

### Google OAuth not working
- Check GOOGLE_CLIENT_ID is set in both `.env` and Vercel
- Verify authorized origins in Google Cloud Console
- Make sure to wrap app in GoogleOAuthProvider

### Database connection failed
- Verify DATABASE_URL is correct
- Check if PostgreSQL is running
- Ensure database exists

## 📞 Support

For issues or questions:
- Email: satikshpatel8@gmail.com
- GitHub: https://github.com/satiksh
- LinkedIn: https://www.linkedin.com/in/satikshpatel/

## 🎉 You're All Set!

Once you've completed these steps, you'll have:
- ✅ A fully functional authentication system
- ✅ Role-based access (Client, Freelancer/Agency, Admin)
- ✅ Beautiful founder/about page
- ✅ Database ready for complex workflows
- ✅ Foundation for bidding and contract systems

Continue building the remaining dashboards and features as outlined in `IMPLEMENTATION_GUIDE.md`!
