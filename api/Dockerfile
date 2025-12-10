FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN apk add --no-cache openssl
RUN npm ci

COPY . .
COPY ../db/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "run", "dev"]
