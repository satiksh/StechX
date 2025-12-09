import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      country: true,
      portfolioUrl: true,
      skills: true,
    },
  });

  return users;
};

export const getAllProjects = async () => {
  const projects = await prisma.project.findMany({
    include: {
      client: {
        select: {
          name: true,
          email: true,
        },
      },
      talent: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return projects;
};

export const getAllApplications = async () => {
  const applications = await prisma.application.findMany({
    include: {
      talent: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return applications;
};
