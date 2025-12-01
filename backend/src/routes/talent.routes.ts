import { Router } from 'express';
import { applyAsTalent, getTalentProfileController } from '../controllers/talent.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { applicationSchema } from '../validators/application.validator';

const router = Router();

router.post('/apply', authenticate, validate(applicationSchema), applyAsTalent);
router.get('/profile', authenticate, getTalentProfileController);

export default router;
