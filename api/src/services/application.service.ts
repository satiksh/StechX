import { PrismaClient, Position, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createApplication = async (
  position: Position,
  portfolioUrl: string,
  experience: string,
  talentId?: string
) => {
  const application = await prisma.application.create({
    data: {
      position,
      portfolioUrl,
      experience,
      status: ApplicationStatus.Submitted,
      // talentId is optional; will be null if not provided
      talentId: talentId || null,
    },
  });

  return application;
};
