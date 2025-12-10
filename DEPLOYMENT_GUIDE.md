# 🚀 Deployment Guide - StechX Platform

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Database backups configured
- [ ] Environment variables set
- [ ] JWT_SECRET configured
- [ ] Google OAuth configured
- [ ] Build completes without errors

---

## 1. Production Environment Setup

### Step 1: Update Environment Variables

**`.env.local` → Production values:**

```env
# Database (Production)
DATABASE_URL="postgresql://user:password@prod-db.railway.app:5432/stechx"

# JWT Secret (Generate strong random string)
JWT_SECRET="$(openssl rand -base64 32)"

# Google OAuth (Production credentials)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-production-client-id.apps.googleusercontent.com"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="https://your-domain.com"
NODE_ENV="production"
```

### Step 2: Build for Production

```bash
cd /Users/satikshpatel/stechx/web

# Install dependencies
npm install

# Build the application
npm run build

# Test build locally
npm start
```

---

## 2. Deploy to Vercel (Recommended)

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/satikshpatel/stechx/web
vercel --prod

# Follow prompts to connect GitHub repository
```

### Option B: Using GitHub Integration

1. Push code to GitHub repository
2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Click "Deploy"

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID": "@google_client_id"
  }
}
```

---

## 3. Database Setup (Railway)

### Step 1: Create Production Database

1. Go to https://railway.app
2. Create new PostgreSQL database
3. Note the connection string
4. Update DATABASE_URL in Vercel environment variables

### Step 2: Run Migrations

```bash
# From your local machine (before first deployment)
cd /Users/satikshpatel/stechx

npx prisma migrate deploy
npx prisma db seed # If seed script exists
```

### Step 3: Verify Connection

```bash
npx prisma studio
# Should connect to production database
```

---

## 4. Configure Domain & SSL

### Step 1: Add Custom Domain (Vercel)

1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your domain (e.g., `stechx.com`)
4. Follow DNS configuration instructions

### Step 2: SSL Certificate

- Vercel automatically provisions SSL/TLS certificate
- Redirects HTTP → HTTPS automatically

---

## 5. Google OAuth Production Setup

### Step 1: Update OAuth Credentials

1. Go to Google Cloud Console
2. Update authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback`
   - `https://your-domain.com`
   - `https://www.your-domain.com`

### Step 2: Update NEXT_PUBLIC_GOOGLE_CLIENT_ID

```bash
# In Vercel Environment Variables
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-production-client-id"
```

---

## 6. Monitoring & Analytics

### Step 1: Set Up Error Tracking

**Using Sentry:**

```bash
npm install @sentry/nextjs

# Configure Sentry in app/layout.tsx
```

### Step 2: Add Google Analytics

```html
<!-- In app/layout.tsx or _document.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Step 3: Add LogRocket (Optional)

```bash
npm install logrocket
```

---

## 7. Performance Optimization

### Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60' }
      ]
    }
  ]
};
```

### Image Optimization

```typescript
import Image from 'next/image';

// Use next/image for automatic optimization
<Image src="/avatar.jpg" alt="Avatar" width={50} height={50} />
```

---

## 8. Database Backup Strategy

### Automated Backups (Railway)

1. Railway automatically backs up PostgreSQL
2. Backups retained for 30 days
3. Manual backup:

```bash
# Export database
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql

# Restore from backup
psql "$DATABASE_URL" < backup-20240101.sql
```

---

## 9. CI/CD Pipeline Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 10. Post-Deployment Testing

### Test Checklist

- [ ] App loads at custom domain
- [ ] All pages render correctly
- [ ] Authentication works
- [ ] Google OAuth works
- [ ] API calls succeed
- [ ] Database queries work
- [ ] Notifications send
- [ ] Errors logged to Sentry
- [ ] Analytics tracking data
- [ ] SSL certificate valid

### Monitor Performance

```bash
# Check Lighthouse scores
npm run lighthouse

# Monitor with Vercel Analytics
# View at: vercel.com/your-project/analytics
```

---

## 11. Scaling Considerations

### Database

- Monitor connection pool
- Add read replicas for heavy loads
- Implement query caching
- Use database indexing

### Application

- Enable Redis caching
- Implement rate limiting
- Use CDN for static assets
- Monitor memory usage

### Infrastructure

- Set up auto-scaling
- Configure load balancing
- Monitor uptime
- Set up alerts

---

## 12. Security Hardening

### Before Going Live

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix issues
npm audit fix
```

### SSL/TLS Configuration

```typescript
// Add security headers in middleware
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' }
];
```

### Rate Limiting

```bash
npm install express-rate-limit

# Apply to API routes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## 13. Rollback Plan

### If Deployment Fails

```bash
# Revert to previous deployment
vercel --prod --yes

# Check deployment history
vercel ls

# Rollback specific deployment
vercel rollback <deployment-url>
```

---

## 14. Monitoring Dashboard

### Key Metrics to Track

1. **Application**
   - Page load time
   - API response time
   - Error rate

2. **Database**
   - Connection pool usage
   - Query performance
   - Backup status

3. **Infrastructure**
   - CPU usage
   - Memory usage
   - Bandwidth

4. **Business**
   - User signups
   - Projects posted
   - Bids placed
   - Contracts created

---

## 15. Maintenance Schedule

### Daily
- Monitor error logs
- Check uptime
- Review alerts

### Weekly
- Security updates
- Performance review
- Backup verification

### Monthly
- Dependency updates
- Performance optimization
- Security audit

### Quarterly
- Capacity planning
- Feature planning
- Customer feedback review

---

## Troubleshooting

### Common Deployment Issues

**Issue: Database connection failed**
```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin
```

**Issue: Build fails**
```bash
# Clear cache and rebuild
npm run build

# Check build logs in Vercel
vercel logs --follow
```

**Issue: Environment variables not loading**
```bash
# Verify in Vercel dashboard
# Settings → Environment Variables → Check all values present

# Redeploy
vercel --prod --yes
```

**Issue: Google OAuth not working**
```bash
# Verify OAuth credentials are correct
# Check authorized redirect URIs
# Ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Railway Docs**: https://railway.app/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## Final Checklist Before Launch

- [ ] Domain configured and SSL working
- [ ] Database connected and migrated
- [ ] All environment variables set
- [ ] Monitoring and alerts configured
- [ ] Backups automated
- [ ] CI/CD pipeline working
- [ ] Error tracking enabled
- [ ] Analytics enabled
- [ ] Team notified of launch
- [ ] Documentation updated
- [ ] Support team trained
- [ ] Launch announcement ready

---

**Your app is ready to go live! 🚀**

Start with: `npm run build` in `/web` directory
