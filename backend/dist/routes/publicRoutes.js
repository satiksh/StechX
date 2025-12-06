"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/publicRoutes.ts
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const projectController_1 = require("../controllers/projectController");
const testimonialController_1 = require("../controllers/testimonialController");
const applicationController_1 = require("../controllers/applicationController");
const validateRequest_1 = require("../middleware/validateRequest");
const applicationValidators_1 = require("../validators/applicationValidators");
const router = (0, express_1.Router)();
// Services
// GET /api/services
router.get('/services', serviceController_1.getServices);
// GET /api/services/:slug
router.get('/services/:slug', serviceController_1.getServiceBySlug);
// Projects
// GET /api/projects?service=web|app|video|ai
router.get('/projects', projectController_1.getProjects);
// GET /api/projects/:slug
router.get('/projects/:slug', projectController_1.getProjectBySlug);
// Testimonials
// GET /api/testimonials
router.get('/testimonials', testimonialController_1.getTestimonials);
// Contact & Applications
// POST /api/contact
router.post('/contact', (0, validateRequest_1.validateBody)(applicationValidators_1.contactSchema), applicationController_1.submitContact);
// POST /api/apply/client
router.post('/apply/client', (0, validateRequest_1.validateBody)(applicationValidators_1.clientApplicationSchema), applicationController_1.applyClient);
// POST /api/apply/talent
router.post('/apply/talent', (0, validateRequest_1.validateBody)(applicationValidators_1.talentApplicationSchema), applicationController_1.applyTalent);
exports.default = router;
//# sourceMappingURL=publicRoutes.js.map