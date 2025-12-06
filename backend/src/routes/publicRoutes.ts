import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
} from '../controllers/serviceController';
import {
  getProjects,
  getProjectBySlug,
} from '../controllers/projectController';
import { getTestimonials } from '../controllers/testimonialController';
import {
  submitContact,
  applyClient,
  applyTalent,
} from '../controllers/applicationController';
import { validateBody } from '../middleware/validateRequest';
import {
  contactSchema,
  clientApplicationSchema,
  talentApplicationSchema,
} from '../validators/applicationValidators';
import { prisma } from '../utils/prismaClient';

const router = Router();

// Services
// GET /api/services
router.get('/services', getServices);

// GET /api/services/:slug
router.get('/services/:slug', getServiceBySlug);

// Projects
// GET /api/projects?service=web|app|video|ai
router.get('/projects', getProjects);

// GET /api/projects/:slug
router.get('/projects/:slug', getProjectBySlug);

// Testimonials
// GET /api/testimonials
router.get('/testimonials', getTestimonials);

// Applications
// GET /api/applications
router.get('/applications', async (_req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    console.error('Failed to fetch applications', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Contact & Applications
// POST /api/contact
router.post('/contact', validateBody(contactSchema), submitContact);

// POST /api/apply/client
router.post('/apply/client', validateBody(clientApplicationSchema), applyClient);

// POST /api/apply/talent
router.post('/apply/talent', validateBody(talentApplicationSchema), applyTalent);

export default router;