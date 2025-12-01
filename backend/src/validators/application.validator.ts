import { z } from 'zod';
import { Position } from '../types';

export const applicationSchema = z.object({
  body: z.object({
    talentId: z.string().uuid('Invalid talent ID'),
    position: z.nativeEnum(Position),
    portfolioUrl: z.string().url('Invalid portfolio URL'),
    experience: z.string().min(1, 'Experience is required'),
  }),
});
