import { z } from 'zod';
import { ProjectType } from '../types';

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    projectType: z.nativeEnum(ProjectType),
    budget: z.number().positive('Budget must be positive'),
    message: z.string().min(1, 'Message is required'),
  }),
});
