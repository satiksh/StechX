// src/validators/adminTestimonialValidators.ts
import { z } from 'zod';

export const createTestimonialSchema = z.object({
  clientName: z.string().min(1),
  clientRole: z.string().min(1),
  quote: z.string().min(1),
  projectId: z.string().uuid().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
