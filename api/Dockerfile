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
# into web/node_modules. That path does not exist (and is wrong) inside the backend image.
# Strip that override so Prisma generates into this service's node_modules.
RUN sed -i '/output[[:space:]]*=.*web\/node_modules\/.prisma\/client/d' ./prisma/schema.prisma

# Generate Prisma client using the copied schema
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
