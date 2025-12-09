import { PrismaClient, ProjectType } from '@prisma/client';

const prisma = new PrismaClient();

export const createContactRequest = async (data: {
  name: string;
  email: string;
  projectType: ProjectType;
  budget: number;
  message: string;
}) => {
  const contactRequest = await prisma.contactRequest.create({
    data,
  });

  return { contactRequestId: contactRequest.id };
};
