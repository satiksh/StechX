"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/adminRoutes.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminProjectController_1 = require("../controllers/adminProjectController");
const adminTestimonialController_1 = require("../controllers/adminTestimonialController");
const adminApplicationController_1 = require("../controllers/adminApplicationController");
const router = (0, express_1.Router)();
// Apply auth + ADMIN role guard to everything below
router.use(authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeRole)(client_1.UserRole.ADMIN));
// Projects (Admin only)
// GET    /api/admin/projects
router.get('/projects', adminProjectController_1.adminGetProjects);
// GET    /api/admin/projects/:id
router.get('/projects/:id', adminProjectController_1.adminGetProjectById);
// POST   /api/admin/projects
router.post('/projects', adminProjectController_1.adminCreateProject);
// PATCH  /api/admin/projects/:id
router.patch('/projects/:id', adminProjectController_1.adminUpdateProject);
// DELETE /api/admin/projects/:id
router.delete('/projects/:id', adminProjectController_1.adminDeleteProject);
// Testimonials (Admin only)
// GET    /api/admin/testimonials
router.get('/testimonials', adminTestimonialController_1.adminGetTestimonials);
// POST   /api/admin/testimonials
router.post('/testimonials', adminTestimonialController_1.adminCreateTestimonial);
// PATCH  /api/admin/testimonials/:id
router.patch('/testimonials/:id', adminTestimonialController_1.adminUpdateTestimonial);
// DELETE /api/admin/testimonials/:id
router.delete('/testimonials/:id', adminTestimonialController_1.adminDeleteTestimonial);
// Applications (Admin only)
// GET    /api/admin/applications
router.get('/applications', adminApplicationController_1.adminGetApplications);
// PATCH  /api/admin/applications/:id
router.patch('/applications/:id', adminApplicationController_1.adminUpdateApplicationStatus);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map