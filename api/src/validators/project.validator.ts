import { z } from 'zod';
import { ProjectType } from '../types';

export const createProjectSchema = z.object({
  body: z.object({
    clientId: z.string().uuid('Invalid client ID'),
    project: z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      type: z.nativeEnum(ProjectType),
      budget: z.number().positive('Budget must be positive'),
      attachments: z.array(z.string().url()).optional().default([]),
    }),
  }),
});
