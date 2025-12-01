import { PrismaClient, Position } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const createApplication = async (
  talentId: string,
  position: Position,
  portfolioUrl: string,
  experience: string
) => {
  const talent = await prisma.user.findUnique({
    where: { id: talentId },
  });

  if (!talent || talent.role !== 'Talent') {
    throw new AppError(404, 'Talent not found');
  }

  const application = await prisma.application.create({
    data: {
      talentId,
      position,
      portfolioUrl,
      experience,
      status: 'Submitted',
    },
  });

  return { applicationId: application.id };
};

export const getTalentProfile = async (talentId: string) => {
  const talent = await prisma.user.findUnique({
    where: { id: talentId },
    include: {
      applications: true,
      talentProjects: true,
    },
  });

  if (!talent) {
    throw new AppError(404, 'Talent not found');
  }

  return {
    user: {
      id: talent.id,
      role: talent.role,
      name: talent.name,
      email: talent.email,
      createdAt: talent.createdAt.toISOString(),
      updatedAt: talent.updatedAt.toISOString(),
      country: talent.country,
      portfolioUrl: talent.portfolioUrl || undefined,
      skills: talent.skills,
    },
    applications: talent.applications,
    projects: talent.talentProjects,
  };
};
