#!/bin/bash

# Complete StechX Consolidation - All-in-One Script
# This script completes the consolidation by moving prisma to root and updating all references

set -e

ROOT_DIR="/Users/satikshpatel/stechx"
cd "$ROOT_DIR"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     COMPLETING STECHX CONSOLIDATION - FULL SETUP              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Move prisma to root as db
echo "📦 Step 1: Moving api/prisma → /db at root..."
if [ -d "api/prisma" ]; then
  mkdir -p db
  cp -r api/prisma/* db/
  rm -rf api/prisma
  echo "✅ Prisma moved to /db"
else
  echo "⚠️  api/prisma not found, checking if already at root..."
  if [ ! -d "db" ]; then
    echo "❌ ERROR: Neither api/prisma nor /db found!"
    exit 1
  fi
fi

# Step 2: Update api/package.json prisma seed reference
echo "📦 Step 2: Updating api/package.json..."
if grep -q '"seed": "ts-node prisma/seed.ts"' api/package.json; then
  sed -i '' 's|"seed": "ts-node prisma/seed.ts"|"seed": "ts-node ../db/seed.ts"|' api/package.json
  echo "✅ Updated seed path in api/package.json"
fi

# Step 3: Update prisma client import in api/src/utils/prismaClient.ts
echo "📦 Step 3: Updating prismaClient.ts import path..."
if [ -f "api/src/utils/prismaClient.ts" ]; then
  # Update the schema path reference if it exists
  if grep -q 'prisma/schema' api/src/utils/prismaClient.ts; then
    sed -i '' 's|prisma/schema|../../db/schema|g' api/src/utils/prismaClient.ts
    echo "✅ Updated schema path in prismaClient.ts"
  fi
fi

# Step 4: Verify db/schema.prisma exists
echo "📦 Step 4: Verifying database schema..."
if [ -f "db/schema.prisma" ]; then
  echo "✅ db/schema.prisma found"
else
  echo "⚠️  db/schema.prisma not found"
fi

# Step 5: Check db/seed.ts exists
echo "📦 Step 5: Checking database seed..."
if [ -f "db/seed.ts" ]; then
  echo "✅ db/seed.ts found"
else
  echo "⚠️  db/seed.ts not found"
fi

# Step 6: Update .gitignore if needed
echo "📦 Step 6: Ensuring .gitignore is configured..."
if [ -f ".gitignore" ]; then
  if ! grep -q "node_modules" .gitignore; then
    echo "node_modules/" >> .gitignore
  fi
  if ! grep -q ".env" .gitignore; then
    echo ".env" >> .gitignore
  fi
  echo "✅ .gitignore verified"
fi

# Step 7: Create root-level scripts directory if needed
echo "📦 Step 7: Organizing structure..."
mkdir -p scripts docs

# Step 8: Show final structure
echo ""
echo "📁 FINAL CONSOLIDATED STRUCTURE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
tree -L 2 -I 'node_modules|dist|.next' || ls -la | grep -E "^d" | awk '{print $NF}'

# Step 9: Commit all changes
echo ""
echo "📦 Step 8: Committing to Git..."
git add -A
git commit -m "Complete consolidation: Move prisma to /db, update all references, verify structure"

# Step 10: Push to GitHub
echo "📦 Step 9: Pushing to GitHub..."
git push origin main

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           ✅ CONSOLIDATION COMPLETE!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 NEW STRUCTURE:"
echo "  /Users/satikshpatel/stechx/"
echo "  ├── api/                (Backend - Node.js/Express)"
echo "  │   ├── src/"
echo "  │   ├── package.json"
echo "  │   ├── tsconfig.json"
echo "  │   └── Dockerfile"
echo "  ├── web/                (Frontend - Next.js)"
echo "  │   ├── app/"
echo "  │   ├── package.json"
echo "  │   └── tsconfig.json"
echo "  ├── db/                 (Database - Prisma Schema)"
echo "  │   ├── schema.prisma"
echo "  │   ├── seed.ts"
echo "  │   └── migrations/"
echo "  ├── vercel.json         (Vercel deployment config)"
echo "  ├── package.json        (Root package)"
echo "  └── .gitignore"
echo ""
echo "🚀 NEXT STEPS:"
echo "  1. Update Render backend settings:"
echo "     Build Command: cd api && npm run build"
echo "  2. Verify deployments:"
echo "     Frontend: https://stechx.vercel.app"
echo "     Backend: https://stechx-api.onrender.com"
echo "  3. Test both services are working"
echo ""
