FROM node:22-alpine

WORKDIR /app

# Install dependencies (paths assume build context is repo root)
COPY api/package.json api/package-lock.json ./
RUN apk add --no-cache openssl
RUN npm ci

# Copy application source
COPY api/ .

# Copy Prisma schema from repo root db/ directory
COPY db/schema.prisma ./prisma/schema.prisma

# The shared db/schema.prisma is configured for the Next.js app to generate Prisma Client
# into web/node_modules. That path is wrong inside the backend image.
# Remove that override so Prisma generates into this service's node_modules.
RUN node -e "const fs=require('fs'); const p='./prisma/schema.prisma'; let s=fs.readFileSync(p,'utf8'); s=s.replace(/^\s*output\s*=\s*\"\.\.\/web\/node_modules\/\.prisma\/client\"\s*\r?\n/m,''); fs.writeFileSync(p,s);"
RUN ! grep -q "\.\./web/node_modules/\.prisma/client" ./prisma/schema.prisma

# Generate Prisma client using the copied schema
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
