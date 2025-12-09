import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServices = async () => {
  const services = await prisma.service.findMany();
  return { services };
};
