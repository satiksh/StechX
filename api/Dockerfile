FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN apk add --no-cache openssl
RUN npm ci

# Copy application source (build context is api/)
COPY . .

# Generate Prisma client using the schema inside api/prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
