#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STECHX - GITHUB & VERCEL DEPLOYMENT SCRIPT${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Check if Git is installed
echo -e "${YELLOW}Step 1: Checking Git installation...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git is installed${NC}"
echo ""

# Step 2: Check current directory
echo -e "${YELLOW}Step 2: Verifying we're in the stechx directory...${NC}"
if [ ! -f "package.json" ] || [ ! -d "web" ] || [ ! -d "api" ]; then
    echo -e "${RED}❌ Not in stechx root directory${NC}"
    exit 1
fi
echo -e "${GREEN}✅ We're in the correct directory${NC}"
echo ""

# Step 3: Check Git status
echo -e "${YELLOW}Step 3: Checking Git status...${NC}"
git status
echo ""

# Step 4: Add all changes
echo -e "${YELLOW}Step 4: Adding all changes to Git...${NC}"
git add .
echo -e "${GREEN}✅ All changes added${NC}"
echo ""

# Step 5: Commit changes
echo -e "${YELLOW}Step 5: Creating commit...${NC}"
COMMIT_MESSAGE="Deploy: Production-ready StechX - mobile responsive UI, APIs configured, ready for Vercel & Render"
git commit -m "$COMMIT_MESSAGE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Commit created successfully${NC}"
else
    echo -e "${YELLOW}⚠️  No changes to commit (already up to date)${NC}"
fi
echo ""

# Step 6: Push to GitHub
echo -e "${YELLOW}Step 6: Pushing to GitHub...${NC}"
echo -e "${BLUE}Running: git push origin main${NC}"
git push origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    echo -e "${YELLOW}Try running: git push -u origin main${NC}"
    exit 1
fi
echo ""

# Step 7: Verify push
echo -e "${YELLOW}Step 7: Verifying push...${NC}"
git log -1 --oneline
echo -e "${GREEN}✅ Latest commit pushed${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ GITHUB PUSH COMPLETE!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Display verification steps
echo -e "${YELLOW}📋 VERIFY ON GITHUB:${NC}"
echo "   1. Go to: https://github.com/satiksh/stechx"
echo "   2. Check that main branch has the latest commit"
echo "   3. You should see the folders: web/, api/, db/"
echo ""

# Display next steps
echo -e "${YELLOW}🚀 NEXT STEPS:${NC}"
echo ""
echo -e "${BLUE}DEPLOY FRONTEND TO VERCEL:${NC}"
echo "   1. Go to: https://vercel.com/new"
echo "   2. Select 'Import Git Repository'"
echo "   3. Find and select: satiksh/stechx"
echo "   4. Configure:"
echo "      - Framework: Next.js (auto-detected)"
echo "      - Root Directory: web"
echo "      - Build Command: npm run build"
echo "   5. Add Environment Variables:"
echo "      - NEXT_PUBLIC_API_BASE_URL = https://stechx-api.onrender.com"
echo "      - NEXT_PUBLIC_GOOGLE_CLIENT_ID = [your-google-client-id]"
echo "   6. Click 'Deploy'"
echo "   7. Wait 3-5 minutes for deployment"
echo ""

echo -e "${BLUE}DEPLOY BACKEND TO RENDER:${NC}"
echo "   1. Go to: https://render.com/dashboard"
echo "   2. Click 'New +' → 'Web Service'"
echo "   3. Connect GitHub repository: satiksh/stechx"
echo "   4. Configure:"
echo "      - Name: stechx-api"
echo "      - Root Directory: api"
echo "      - Runtime: Node"
echo "      - Build Command: npm run build || true"
echo "      - Start Command: npm start"
echo "   5. Add Environment Variables:"
      DATABASE_URL = [your-azure-postgresql-connection-string]
echo "      JWT_SECRET = [your-jwt-secret-key]"
echo "      GOOGLE_CLIENT_ID = [your-google-client-id]"
echo "      GOOGLE_CLIENT_SECRET = [your-google-client-secret]"
echo "      FRONTEND_URL = https://stechx.vercel.app"
echo "      NODE_ENV = production"
echo "   6. Click 'Create Web Service'"
echo "   7. Wait 5-10 minutes for deployment"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  You're all set! Push to GitHub completed successfully 🎉${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
