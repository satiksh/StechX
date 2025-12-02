// src/routes/publicRoutes.ts
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

// Contact & Applications
// POST /api/contact
router.post('/contact', validateBody(contactSchema), submitContact);

// POST /api/apply/client
router.post('/apply/client', validateBody(clientApplicationSchema), applyClient);

// POST /api/apply/talent
router.post('/apply/talent', validateBody(talentApplicationSchema), applyTalent);

export default router;
