// src/routes/adminRoutes.ts
import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate, authorizeRole } from '../middleware/authMiddleware';
import {
  adminGetProjects,
  adminGetProjectById,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
} from '../controllers/adminProjectController';
import {
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from '../controllers/adminTestimonialController';
import {
  adminGetApplications,
  adminUpdateApplicationStatus,
} from '../controllers/adminApplicationController';

const router = Router();

// Apply auth + ADMIN role guard to everything below
router.use(authenticate, authorizeRole(UserRole.ADMIN));

// Projects (Admin only)
// GET    /api/admin/projects
router.get('/projects', adminGetProjects);

// GET    /api/admin/projects/:id
router.get('/projects/:id', adminGetProjectById);

// POST   /api/admin/projects
router.post('/projects', adminCreateProject);

// PATCH  /api/admin/projects/:id
router.patch('/projects/:id', adminUpdateProject);

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', adminDeleteProject);

// Testimonials (Admin only)
// GET    /api/admin/testimonials
router.get('/testimonials', adminGetTestimonials);

// POST   /api/admin/testimonials
router.post('/testimonials', adminCreateTestimonial);

// PATCH  /api/admin/testimonials/:id
router.patch('/testimonials/:id', adminUpdateTestimonial);

// DELETE /api/admin/testimonials/:id
router.delete('/testimonials/:id', adminDeleteTestimonial);

// Applications (Admin only)
// GET    /api/admin/applications
router.get('/applications', adminGetApplications);

// PATCH  /api/admin/applications/:id
router.patch('/applications/:id', adminUpdateApplicationStatus);

export default router;
