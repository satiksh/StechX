// src/controllers/serviceController.ts
import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json(services);
  } catch (error: any) {
    console.error('getServices error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error: any) {
    console.error('getServiceBySlug error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};
