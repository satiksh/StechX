# ⚡ QUICK DEPLOYMENT COMMANDS

## 1️⃣ PUSH TO GITHUB (Copy & Paste)

```bash
cd /Users/satikshpatel/stechx
git add .
git commit -m "Deploy: Production-ready StechX with responsive UI and APIs configured"
git push origin main
```

**Verify**: https://github.com/satiksh/stechx

---

## 2️⃣ DEPLOY BACKEND (Render)

### Create Account & Connect GitHub
- https://render.com
- Click: New Web Service
- Connect: satiksh/stechx repo

### Configuration
```
Name: stechx-api
Root Directory: api
Build Command: npm run build || true
Start Command: npm start
```

### Environment Variables (Copy & Paste Each)

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

### Click: Deploy
⏱️ Wait 5-10 minutes for "Live" status

### Test
```
https://stechx-api.onrender.com/health
```
Expected: `{"status":"ok"...}`

---

## 3️⃣ DEPLOY FRONTEND (Vercel)

### Create Account & Import GitHub
- https://vercel.com
- Click: Add New → Project
- Click: Import Git Repository
- Search & Select: satiksh/stechx

### Important: Set Root Directory to `web`
- Click the Root Directory dropdown
- Select: `web` ← MUST DO THIS!

### Environment Variables (Copy & Paste Each)

```
NEXT_PUBLIC_API_BASE_URL
https://stechx-api.onrender.com

NEXT_PUBLIC_GOOGLE_CLIENT_ID
446798573358-0gg1itniepvvb89stmfgpmivskmjkb00.apps.googleusercontent.com
```

### Click: Deploy
⏱️ Wait 3-5 minutes for "Production" status

### Access
```
https://stechx.vercel.app
```

---

## 4️⃣ UPDATE GOOGLE OAUTH

1. https://console.cloud.google.com
2. Select your project
3. APIs & Services → Credentials
4. Click your OAuth 2.0 Client ID

### Add to "Authorized JavaScript origins"
```
https://stechx.vercel.app
https://stechx-api.onrender.com
```

### Add to "Authorized redirect URIs"
```
https://stechx.vercel.app/auth/callback
https://stechx-api.onrender.com/api/auth/google
```

### Save

---

## 5️⃣ TEST EVERYTHING

### Frontend Tests
- [ ] https://stechx.vercel.app loads
- [ ] Homepage displays
- [ ] Navigation works
- [ ] Mobile menu works
- [ ] All pages load

### API Tests (DevTools F12)
- [ ] Open Console → No red errors
- [ ] Open Network tab
- [ ] Refresh page
- [ ] Look for API calls
- [ ] Should see requests to stechx-api.onrender.com

### Mobile Tests (DevTools Device Mode)
- [ ] Hamburger menu visible
- [ ] Text readable
- [ ] No horizontal scroll
- [ ] Layout responsive

---

## 📋 SUMMARY

| Step | Time | Status |
|------|------|--------|
| 1. Push to GitHub | 2 min | First |
| 2. Deploy Backend (Render) | 10 min | Second |
| 3. Deploy Frontend (Vercel) | 5 min | Third |
| 4. Update Google OAuth | 3 min | Fourth |
| 5. Test Everything | 5 min | Final |
| **TOTAL** | **25 min** | 🎉 Live! |

---

## ✅ WHEN COMPLETE

Your URLs are:
- **Frontend**: https://stechx.vercel.app
- **Backend**: https://stechx-api.onrender.com
- **Both working together** ✅

Share frontend URL with users!

---

## 🆘 COMMON ISSUES

### "Frontend won't load"
→ Check Root Directory is set to `web` in Vercel

### "API not connecting"
→ Check NEXT_PUBLIC_API_BASE_URL in Vercel matches Render URL

### "Build failed"
→ Check build logs in Render/Vercel dashboard

### "Google login doesn't work"
→ Update OAuth URIs in Google Cloud Console

---

**Need help? Each platform has live chat support!**
- Vercel: https://vercel.com/help
- Render: https://render.com/docs
