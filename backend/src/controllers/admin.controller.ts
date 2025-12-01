import { Request, Response, NextFunction } from 'express';
import { getAllUsers, getAllProjects, getAllApplications } from '../services/user.service';

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    const projects = await getAllProjects();
    const applications = await getAllApplications();

    res.status(200).json({
      users,
      projects,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
