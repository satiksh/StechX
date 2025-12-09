import { Router } from 'express';
import { hireTalent, getClientProjectsController } from '../controllers/client.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProjectSchema } from '../validators/project.validator';

const router = Router();

router.post('/hire-talent', authenticate, validate(createProjectSchema), hireTalent);
router.get('/projects', authenticate, getClientProjectsController);

export default router;
