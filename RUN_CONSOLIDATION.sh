#!/bin/bash
# Run these commands in your terminal to consolidate the folders

cd /Users/satikshpatel/stechx

# Step 1: Rename folders
mv backend api
mv frontend web
mv prisma db

# Step 2: Update vercel.json
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

# Step 3: Verify structure
echo "New structure:"
ls -la | grep -E "api|web|db|vercel"

# Step 4: Commit and push
git add -A
git commit -m "Consolidate: backend→api, frontend→web, prisma→db + update vercel.json"
git push origin main

echo "✅ All done! Your folder structure is now consolidated."
