# 🎯 StechX - Transparent Marketplace for Technology Services

**A complete end-to-end platform for connecting clients with freelancers and agencies**

## 🌟 Features

### For Clients
✅ Post projects with custom or preset budgets  
✅ Browse freelancer bids and profiles  
✅ Accept best bids  
✅ Track project progress  
✅ Digital contract signing  
✅ Transparent pricing (80% max bid rule)  

### For Freelancers & Agencies
✅ Browse available projects  
✅ Place competitive bids (max 80% of budget)  
✅ Win projects with 24-hour acceptance window  
✅ Track earned income  
✅ Build reputation with ratings  
✅ Digital contract management  

### For Admins
✅ Manage all users (suspend/unsuspend)  
✅ Approve contracts with Google Meet links  
✅ View platform statistics  
✅ Monitor revenue and transactions  

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/satiksh/stechx.git
cd stechx/web

# Install dependencies
npm install

# Set up environment variables
# Copy .env.local and add your values:
# - DATABASE_URL
# - JWT_SECRET
# - NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Set up database
npx prisma migrate dev

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📚 Documentation

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing scenarios
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Commands and endpoints
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical overview

## 🏗 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + Google OAuth |

## 💰 How It Works

1. **Client posts project** with budget ($500-$100,000)
2. **System calculates max bid** (80% of budget)
3. **Freelancers place bids** (≤ 80% max)
4. **Client accepts best bid** → Bid status: WON
5. **Freelancer has 24 hours** to accept or reject
6. **Accept → Contract created** with 30% advance payment
7. **Admin approves** → Google Meet link added
8. **Both sign contract** → Escrow released (30%)
9. **Work begins** → Status: IN_PROGRESS
10. **Final payment released** → Project complete

## 🔒 Security

- JWT token authentication
- Password hashing with bcryptjs
- Role-based access control (ADMIN, CLIENT, FREELANCER, AGENCY)
- Input validation and sanitization
- Protected API routes with middleware
- User suspension capability

## 📊 Architecture

```
Database: PostgreSQL with Prisma ORM
├── User (roles: ADMIN, CLIENT, FREELANCER, AGENCY)
├── Job (projects posted by clients)
├── Bid (freelancer proposals with 80% validation)
├── Contract (agreements with 30% advance payment)
├── Payment (escrow transactions)
└── Notification (real-time alerts)

API: 25+ RESTful endpoints
├── Authentication (signup, signin, Google OAuth)
├── Projects (CRUD operations)
├── Bids (placement, acceptance, rejection)
├── Contracts (creation, approval, signing)
└── Admin (user management, statistics)
```

## ✨ Key Features

- ✅ 80% max bid validation
- ✅ 24-hour acceptance window
- ✅ 30% advance payment escrow
- ✅ Google Meet integration
- ✅ Digital signatures
- ✅ Rating system with rejection tracking
- ✅ Admin panel for platform management
- ✅ Real-time notifications
- ✅ Complete error handling
- ✅ Production-ready code

## 🚀 Deploy to Production

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# See DEPLOYMENT_GUIDE.md for detailed instructions
```

## 📞 Support

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete testing instructions and [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment.

## 📄 License

MIT License

---

**Version**: 1.0.0 | **Status**: Production Ready ✅

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# StechX
