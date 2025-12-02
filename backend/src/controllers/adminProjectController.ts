// src/controllers/adminProjectController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/adminProjectValidators';

export const adminGetProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { service: true, testimonials: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(projects);
  } catch (error: any) {
    console.error('adminGetProjects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const adminGetProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { service: true, testimonials: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error: any) {
    console.error('adminGetProjectById error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const adminCreateProject = async (req: Request, res: Response) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        serviceId: data.serviceId,
        thumbnailUrl: data.thumbnailUrl,
        imageUrls: data.imageUrls,
        summary: data.summary,
        caseStudy: data.caseStudy,
        isFeatured: data.isFeatured ?? false,
      },
    });

    res.status(201).json(project);
  } catch (error: any) {
    console.error('adminCreateProject error:', error);
    res.status(400).json({ error: error.message || 'Failed to create project' });
  }
};

export const adminUpdateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateProjectSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    res.status(200).json(project);
  } catch (error: any) {
    console.error('adminUpdateProject error:', error);
    res.status(400).json({ error: error.message || 'Failed to update project' });
  }
};

export const adminDeleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('adminDeleteProject error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete project' });
  }
};
