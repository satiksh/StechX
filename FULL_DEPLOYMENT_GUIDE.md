# 🚀 STECHX - COMPLETE DEPLOYMENT GUIDE

## WHAT WE'RE DEPLOYING

✅ **Frontend**: Next.js 16.0.7 → Vercel  
✅ **Backend**: Express.js → Render  
✅ **Database**: PostgreSQL → Azure (Already configured)  
✅ **Both**: Will work together seamlessly  

---

## STEP 1️⃣: PUSH TO GITHUB (2 minutes)

### Run the deployment script:

```bash
cd /Users/satikshpatel/stechx
chmod +x DEPLOY_TO_GITHUB_AND_VERCEL.sh
./DEPLOY_TO_GITHUB_AND_VERCEL.sh
```

**What this does:**
- ✅ Adds all changes to Git
- ✅ Creates a commit with message
- ✅ Pushes to GitHub main branch
- ✅ Shows you verification steps

### Verify on GitHub:
1. Go to: https://github.com/satiksh/stechx
2. Click on "main" branch
3. You should see the latest commit with message starting with "Deploy:"
4. Verify folders exist: `web/`, `api/`, `db/`

---

## STEP 2️⃣: DEPLOY BACKEND ON RENDER (10 minutes)

### Why Render?
- Free tier available
- Connects directly to GitHub
- Auto-deploys on push
- PostgreSQL support built-in

### A. Create Render Account
1. Go to: https://render.com
2. Click **Sign up with GitHub**
3. Authorize Render to access your GitHub
4. Complete signup

### B. Create Web Service for Backend

1. **Dashboard** → Click **New +** button
2. Select **Web Service**
3. **Connect Repository**:
   - Find `satiksh/stechx`
   - Click **Connect**
4. **Configure Web Service**:
   - **Name**: `stechx-api`
   - **Environment**: `Node`
   - **Build Command**: `npm run build || true`
   - **Start Command**: `npm start`
   - **Root Directory**: `api`
   - **Instance Type**: Free (for now)

### C. Add Environment Variables

In Render dashboard, scroll down to **Environment**:

```
DATABASE_URL
[your-azure-postgresql-connection-string]

JWT_SECRET
[your-jwt-secret-key]

GOOGLE_CLIENT_ID
[your-google-client-id]

GOOGLE_CLIENT_SECRET
[your-google-client-secret]

FRONTEND_URL
https://stechx.vercel.app

NODE_ENV
production

PORT
4000
```

### D. Deploy
- Click **Create Web Service**
- Watch the build logs
- Wait for **"Live"** status ✅
- Your backend URL: `https://stechx-api.onrender.com`

### E. Test Backend
Visit: `https://stechx-api.onrender.com/health`

Expected response:
```json
{
  "status": "ok",
  "message": "StechX Backend API is running"
}
```

**✅ Backend is live!**

---

## STEP 3️⃣: DEPLOY FRONTEND ON VERCEL (5 minutes)

### Why Vercel?
- Made by Next.js creators
- Zero-config deployment
- Auto-deploys on GitHub push
- Perfect for Next.js apps

### A. Create Vercel Account
1. Go to: https://vercel.com
2. Click **Sign up** → **Continue with GitHub**
3. Authorize Vercel
4. Complete signup

### B. Import GitHub Repository

1. **Dashboard** → Click **Add New...** → **Project**
2. Click **Import Git Repository**
3. Search for `stechx`
4. Click **Import** on the `satiksh/stechx` repo
5. Vercel auto-detects it's a monorepo

### C. Configure Project

**Important! You MUST set Root Directory to `web`**

1. **Framework Preset**: Next.js (auto-detected) ✅
2. **Root Directory**: Click the dropdown, select `web`
3. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node.js Version: 18.x

### D. Add Environment Variables

Click **Environment Variables** and add:

```
NEXT_PUBLIC_API_BASE_URL
https://stechx-api.onrender.com

NEXT_PUBLIC_GOOGLE_CLIENT_ID
446798573358-0gg1itniepvvb89stmfgpmivskmjkb00.apps.googleusercontent.com
```

### E. Deploy
- Click **Deploy**
- Watch the build logs
- Wait for **"Production"** status ✅
- Your frontend URL: `https://stechx.vercel.app`

**✅ Frontend is live!**

---

## STEP 4️⃣: VERIFY EVERYTHING WORKS (5 minutes)

### A. Test Frontend
1. Go to: https://stechx.vercel.app
2. You should see:
   - ✅ Homepage loads with logo
   - ✅ Navigation bar visible
   - ✅ Hero section displays correctly
   - ✅ All pages accessible

### B. Test API Connection
1. Open browser **DevTools** (F12)
2. Go to **Console** tab
3. Check for errors (should be none)
4. Go to **Network** tab
5. Refresh page
6. Look for API calls to `https://stechx-api.onrender.com`
7. Should see successful responses (200 status)

### C. Test Mobile Responsiveness
1. In DevTools, click **device icon** (top-left of DevTools)
2. Select **iPhone 12** or **iPad**
3. Verify:
   - ✅ Hamburger menu appears on mobile
   - ✅ Text is readable
   - ✅ No horizontal scrolling
   - ✅ Layout adjusts properly

### D. Test Authentication (Optional)
1. Click **Sign In** button
2. Click **Google Sign In**
3. Sign in with your Google account
4. Should see dashboard after login

---

## STEP 5️⃣: UPDATE GOOGLE OAUTH (3 minutes)

Update authorized domains to accept production URLs:

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Update **Authorized JavaScript origins**:
   ```
   https://stechx.vercel.app
   https://stechx-api.onrender.com
   ```
6. Update **Authorized redirect URIs**:
   ```
   https://stechx.vercel.app/auth/callback
   https://stechx-api.onrender.com/api/auth/google
   ```
7. Click **Save**

---

## 🎯 FINAL CHECKLIST

- [ ] Pushed code to GitHub
- [ ] Render backend deployed
- [ ] Backend health check works (`/health`)
- [ ] Vercel frontend deployed
- [ ] Frontend loads without errors
- [ ] API calls go to Render (in Network tab)
- [ ] Mobile hamburger menu works
- [ ] Google OAuth updated
- [ ] All pages load correctly

---

## 📊 YOUR DEPLOYMENT URLS

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://stechx.vercel.app | 🟢 Live |
| **Backend API** | https://stechx-api.onrender.com | 🟢 Live |
| **GitHub** | https://github.com/satiksh/stechx | 📁 Code |
| **Database** | Azure PostgreSQL | 🗄️ Connected |

---

## 🔧 TROUBLESHOOTING

### Frontend won't load
**Solution:**
```bash
cd /Users/satikshpatel/stechx/web
rm -rf .next node_modules
npm install
npm run build
```

### API calls failing
**Check:**
1. Is Render backend showing "Live" status?
2. Is `NEXT_PUBLIC_API_BASE_URL` correct in Vercel?
3. Open DevTools → Network tab → look for API errors

**Solution:** Update env vars and redeploy on both Vercel and Render

### Build failing on Vercel
**Check:**
1. Root Directory is set to `web`
2. Build command is correct
3. All dependencies installed

**Solution:** 
```bash
cd /Users/satikshpatel/stechx/web
npm install
npm run build
```

### Build failing on Render
**Check:**
1. Root Directory is set to `api`
2. All environment variables are correct
3. Database connection string is valid

**Solution:** Check Render logs for specific error

### Database connection error
**Verify:**
- `DATABASE_URL` is exactly correct (no typos)
- Azure PostgreSQL is running
- Connection string has `sslmode=require`

---

## 📝 NOTES

### Auto-Deploy on Every Push
Both Vercel and Render watch your GitHub main branch:
- When you push to `main`, both automatically rebuild
- This means your changes are live in ~2-5 minutes

### Scaling Later
- **Render**: Upgrade from Free to Paid tier for better performance
- **Vercel**: Pro tier for better analytics and performance
- **Database**: Already on Azure, can scale independently

### Security
- ✅ JWT_SECRET should be changed regularly
- ✅ Never commit `.env` files
- ✅ Use Vercel/Render dashboard for secrets only
- ✅ Update Google OAuth regularly

---

## 🎉 YOU'RE DONE!

Your StechX app is now:
- ✅ **Live on Vercel** (Frontend)
- ✅ **Live on Render** (Backend)
- ✅ **Connected to PostgreSQL** (Database)
- ✅ **Production-ready** (Mobile responsive)

### Share your app:
Send this link to anyone:
```
https://stechx.vercel.app
```

They can sign up, create projects, post jobs, and apply for work!

---

## 📞 SUPPORT

If something breaks:
1. Check Render logs: https://render.com/dashboard
2. Check Vercel logs: https://vercel.com/dashboard
3. Check GitHub for latest code
4. Redeploy if needed

---

**🚀 Congratulations! StechX is deployed! 🚀**
