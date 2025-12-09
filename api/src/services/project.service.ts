import { PrismaClient, ProjectType } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getPortfolioProjects = async () => {
  const projects = await prisma.project.findMany({
    where: {
      status: 'Completed',
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  return { projects };
};

export const createProject = async (
  clientId: string,
  projectData: {
    title: string;
    description: string;
    type: ProjectType;
    budget: number;
    attachments?: string[];
  }
) => {
  const client = await prisma.user.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    throw new AppError(404, 'Client not found');
  }

  const project = await prisma.project.create({
    data: {
      clientId,
      title: projectData.title,
      description: projectData.description,
      type: projectData.type,
      budget: projectData.budget,
      attachments: projectData.attachments || [],
      status: 'Pending',
    },
  });

  return { projectId: project.id };
};

export const getClientProjects = async (clientId: string) => {
  const client = await prisma.user.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    throw new AppError(404, 'Client not found');
  }

  const projects = await prisma.project.findMany({
    where: { clientId },
    include: {
      talent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return { projects };
};
