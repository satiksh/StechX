// src/index.ts
import 'dotenv/config';
import { app, PORT } from './server';
import { prisma } from './utils/prismaClient';

// Start server
app.listen(PORT, () => {
  console.log(`✅ StechX Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});
