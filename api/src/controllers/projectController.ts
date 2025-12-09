// src/controllers/projectController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { service } = req.query;

    const where: any = {};

    if (typeof service === 'string') {
      where.service = {
        slug: service,
      };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        service: true,
        testimonials: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(projects);
  } catch (error: any) {
    console.error('getProjects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        service: true,
        testimonials: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error: any) {
    console.error('getProjectBySlug error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};
