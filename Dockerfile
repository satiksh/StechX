# Use the backend Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./

RUN apk add --no-cache openssl
RUN npm ci

COPY backend .

RUN npx prisma generate

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "run", "dev"]
