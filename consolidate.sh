#!/bin/bash

# StechX Consolidation Script - Option 2 (Simple)
# This script consolidates frontend and backend into single folder structure

set -e  # Exit on error

ROOT_DIR="/Users/satikshpatel/stechx"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     CONSOLIDATING STECHX FRONTEND & BACKEND - OPTION 2        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

cd "$ROOT_DIR"

# Step 1: Rename backend to api
echo "📦 Step 1: Renaming backend → api..."
if [ -d "backend" ]; then
  mv backend api
  echo "✅ backend → api"
else
  echo "⚠️  backend folder not found"
fi

# Step 2: Rename frontend to web
echo "📦 Step 2: Renaming frontend → web..."
if [ -d "frontend" ]; then
  mv frontend web
  echo "✅ frontend → web"
else
  echo "⚠️  frontend folder not found"
fi

# Step 3: Rename prisma to db
echo "📦 Step 3: Renaming prisma → db..."
if [ -d "prisma" ]; then
  mv prisma db
  echo "✅ prisma → db"
else
  echo "⚠️  prisma folder not found"
fi

# Step 4: Update vercel.json
echo "📦 Step 4: Updating vercel.json..."
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd web && npm run build",
  "devCommand": "cd web && npm run dev",
  "installCommand": "cd web && npm ci",
  "framework": "nextjs",
  "env": [
    {
      "key": "NEXT_PUBLIC_API_BASE_URL",
      "value": "https://stechx-api.onrender.com"
    },
    {
      "key": "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
      "value": "446798573358-0gg1itniepvvb89stmfgpmivskmjkb89stmfgpmivskmjkb00.apps.googleusercontent.com"
    }
  ]
}
EOF
echo "✅ vercel.json updated"

# Step 5: Show new structure
echo ""
echo "📁 NEW STRUCTURE:"
ls -la | grep -E "api|web|db|vercel|package"
echo ""

# Step 6: Git commit
echo "📦 Step 5: Committing changes..."
git add -A
git commit -m "Consolidate: backend→api, frontend→web, prisma→db + update vercel.json"
echo "✅ Committed"

# Step 7: Git push
echo "📦 Step 6: Pushing to GitHub..."
git push origin main
echo "✅ Pushed to main branch"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           ✅ CONSOLIDATION COMPLETE!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 NEW FOLDER STRUCTURE:"
echo "  /Users/satikshpatel/stechx/"
echo "  ├── api/              (Backend API - Node.js)"
echo "  ├── web/              (Frontend - Next.js)"
echo "  ├── db/               (Database - Prisma)"
echo "  ├── vercel.json       (Deployment config) ✅ UPDATED"
echo "  └── package.json"
echo ""
echo "🚀 NEXT STEPS:"
echo "  1. Vercel will auto-redeploy from new vercel.json"
echo "  2. Update Render backend settings:"
echo "     - Build command: cd api && npm run build"
echo "  3. Check deployments:"
echo "     - Frontend: https://stechx.vercel.app"
echo "     - Backend: https://stechx-api.onrender.com"
echo ""
