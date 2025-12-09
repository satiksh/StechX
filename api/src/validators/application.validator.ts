import { z } from 'zod';
import { Position } from '../types';

export const applicationSchema = z.object({
  body: z.object({
    // talentId is optional for public applications (can be attached later after auth)
    talentId: z.string().uuid().optional(),
    position: z.nativeEnum(Position),
    portfolioUrl: z.string().url('Invalid portfolio URL'),
    experience: z.string().min(10, 'Please tell us a bit more about your experience'),
  }),
});
