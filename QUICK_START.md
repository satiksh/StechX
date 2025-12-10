# SteChX Quick Start Guide

## 🚀 Starting the Application

### Option 1: Frontend Only (Demo Mode)
```bash
cd web
npm run dev
```
Open http://localhost:3000 - Frontend will work, auth features disabled until API runs.

### Option 2: Full Stack (Frontend + Backend)

#### Terminal 1 - Start Backend API:
```bash
cd api
npm install  # First time only
npm run dev
```
Backend runs on http://localhost:4000

#### Terminal 2 - Start Frontend:
```bash
cd web
npm install  # First time only
npm run dev
```
Frontend runs on http://localhost:3000

## ✅ Verification Checklist

- [ ] Backend console shows: `"StechX API listening on port 4000"`
- [ ] Frontend shows no "Load failed" error
- [ ] Can navigate to http://localhost:3000
- [ ] Can click "Get a Service" button
- [ ] Can click "Get Hired" button

## 📝 Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health
- **Auth**: http://localhost:3000/auth/login

## 🔧 Environment Setup

Frontend env is already configured in `/web/.env.local`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
DATABASE_URL=...
JWT_SECRET=...
```

Backend reads from system environment and root `.env` file (create if needed).

## 🎯 First Steps

1. Start Backend API (Terminal 1)
2. Start Frontend (Terminal 2)
3. Open http://localhost:3000
4. Click "Get Hired" to sign up as freelancer
5. Create test project as client
6. Place bid as freelancer

## ❌ Troubleshooting "Load failed" Error

**Problem**: Console shows "TypeError: Load failed"  
**Cause**: Backend API not running on port 4000  
**Solution**: 
1. Open Terminal 1 in `/api` directory
2. Run `npm run dev`
3. Wait for "listening on port 4000" message
4. Refresh frontend browser

**If still broken**:
- Check port 4000 is not in use: `lsof -i :4000`
- Kill process if needed: `kill -9 <PID>`
- Restart backend with `npm run dev`

## 📚 Full Documentation

- **TESTING_GUIDE.md** - 50+ test scenarios
- **DEPLOYMENT_GUIDE.md** - Production setup
- **IMPLEMENTATION_SUMMARY.md** - Technical overview
- **QUICK_REFERENCE.md** - API endpoints reference
