"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const router = (0, express_1.Router)();
router.get('/', testimonial_controller_1.getTestimonials);
exports.default = router;
//# sourceMappingURL=testimonial.routes.js.map