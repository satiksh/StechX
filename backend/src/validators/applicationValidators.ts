// src/validators/applicationValidators.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export const clientApplicationSchema = z.object({
  serviceId: z.string().uuid().optional(), // optional per contract
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  budget: z.number().positive().optional(),
});

export const talentApplicationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  experience: z.string().min(1).optional(),
});
