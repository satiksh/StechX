FROM node:22-alpine

WORKDIR /app

# Copy package files from api directory
COPY api/package.json api/package-lock.json ./
RUN apk add --no-cache openssl
RUN npm ci

# Copy api source code
COPY api/ .

# Copy Prisma schema from db directory
COPY db/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
