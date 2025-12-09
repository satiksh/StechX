# StechX - Consolidated Setup Guide

## Current Structure
```
/Users/satikshpatel/stechx/
├── backend/          (Node.js API)
├── frontend/         (Next.js App)
├── prisma/           (Database schema)
└── package.json
```

## Consolidated Structure (Recommended)
```
/Users/satikshpatel/stechx/
├── apps/
│   ├── api/          (Backend - Node.js)
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── ...
│   ├── web/          (Frontend - Next.js)
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── ...
├── packages/
│   ├── database/     (Prisma schema)
│   │   └── prisma/
│   ├── types/        (Shared types)
│   └── utils/        (Shared utilities)
├── vercel.json       (Root deployment config)
├── package.json      (Monorepo root)
└── pnpm-workspace.yaml (or lerna.json)
```

## Setup Steps

### Option 1: Using Monorepo (pnpm/yarn workspaces) - RECOMMENDED
This keeps code organized while sharing dependencies.

**Step 1: Initialize monorepo**
```bash
cd /Users/satikshpatel/stechx
npm install -g pnpm

# Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "stechx-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "start": "pnpm -r start",
    "install": "pnpm install"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0"
  }
}
EOF
```

**Step 2: Reorganize folders**
```bash
# Create app directories
mkdir -p apps/api apps/web packages/database packages/types

# Move backend
mv backend/* apps/api/
rm -rf backend

# Move frontend
mv frontend/* apps/web/
rm -rf frontend

# Move prisma
mv prisma/* packages/database/
rm -rf prisma
```

**Step 3: Update vercel.json**
```json
{
  "buildCommand": "cd apps/web && npm run build",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm ci",
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
```

**Step 4: Update references in code**
- Frontend: Change imports from `../../../backend` to `@stechx/types`
- Backend: Point to `packages/database`

### Option 2: Simpler Single-Folder Setup
Keep both in same root, but cleaner:

```
/Users/satikshpatel/stechx/
├── api/              (Rename from backend)
├── web/              (Rename from frontend)
├── db/               (Rename from prisma)
└── package.json      (Root config only)
```

This requires minimal changes and Vercel config becomes:
```json
{
  "buildCommand": "cd web && npm run build",
  "devCommand": "cd web && npm run dev",
  "installCommand": "cd web && npm ci"
}
```

## Which Option?

| Aspect | Option 1 (Monorepo) | Option 2 (Simple) |
|--------|-------------------|------------------|
| Complexity | Medium (Learning curve) | Low (Quick setup) |
| Scalability | Excellent (Add more apps) | Good (Suitable for 2 apps) |
| Shared Code | Built-in support | Manual management |
| Dependencies | Shared root | Separate per app |
| Deploy Time | Longer builds | Faster builds |
| Team Size | Better for teams | Better for solo |

## Recommended: Option 2 (Simple Consolidation)

Since you're solo and want quick setup:

```bash
# From /Users/satikshpatel/stechx
cd /Users/satikshpatel/stechx
mv backend api
mv frontend web
mv prisma db

# Update vercel.json
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

# Git add and push
git add .
git commit -m "Consolidate frontend and backend into single folder structure"
git push origin main
```

## Deployment After Consolidation

**Vercel:** Will automatically redeploy with new structure from vercel.json
**Render (Backend):** Add build command: `cd api && npm run build`
**Environment Variables:** Update in both Vercel and Render dashboards

## Testing

```bash
# Test locally
cd api && npm run dev          # Terminal 1: Backend on :5000
cd web && npm run dev          # Terminal 2: Frontend on :3000

# Test build
cd web && npm run build
```

---

**Choose your approach and I'll help you implement it!**
