#!/bin/bash

# Cleanup script to remove duplicate file and restart dev server

echo "🧹 Cleaning up duplicate files..."

# Remove the duplicate freelancer dashboard file
if [ -f "web/app/dashboard/freelancer/page-new.tsx" ]; then
  rm web/app/dashboard/freelancer/page-new.tsx
  echo "✅ Deleted: web/app/dashboard/freelancer/page-new.tsx"
else
  echo "ℹ️  File already deleted: web/app/dashboard/freelancer/page-new.tsx"
fi

echo ""
echo "🗑️  Clearing Next.js cache..."
cd web
rm -rf .next
echo "✅ Cache cleared"

echo ""
echo "📦 Installing dependencies (if needed)..."
npm install

echo ""
echo "🚀 Starting development server..."
echo ""
echo "Your app will be available at: http://localhost:3000"
echo ""
npm run dev
