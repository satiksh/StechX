import { defineConfig } from '@prisma/client/config';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/stechx',
    },
  },
});
