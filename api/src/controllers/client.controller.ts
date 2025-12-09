import { Request, Response, NextFunction } from 'express';
import { createProject, getClientProjects } from '../services/project.service';

export const hireTalent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clientId, project } = req.body;
    const result = await createProject(clientId, project);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getClientProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clientId } = req.query;
    const result = await getClientProjects(clientId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
