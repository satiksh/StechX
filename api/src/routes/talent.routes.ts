import { Router } from 'express';
import { applyAsTalent, getTalentProfileController } from '../controllers/talent.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { applicationSchema } from '../validators/application.validator';

const router = Router();

// Public route: anyone can apply as talent
router.post('/apply', validate(applicationSchema), applyAsTalent);

// Protected route: only authenticated users can view their profile
router.get('/profile', authenticate, getTalentProfileController);

export default router;
