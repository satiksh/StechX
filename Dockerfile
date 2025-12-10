# Root-level Dockerfile to build the API service (uses repo root as context)
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY api/package.json api/package-lock.json ./
RUN apk add --no-cache openssl
RUN npm ci

# Copy application source
COPY api/ .

# Copy Prisma schema from db directory
COPY db/schema.prisma ./prisma/schema.prisma

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
