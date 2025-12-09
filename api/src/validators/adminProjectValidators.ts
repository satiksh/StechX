// src/validators/adminProjectValidators.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  serviceId: z.string().uuid(),
  thumbnailUrl: z.string().url(),
  imageUrls: z.array(z.string().url()).default([]),
  summary: z.string().min(1),
  caseStudy: z.string().min(1),
  isFeatured: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
