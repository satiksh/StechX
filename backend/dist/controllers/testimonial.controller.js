"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestimonials = void 0;
const testimonial_service_1 = require("../services/testimonial.service");
const getTestimonials = async (req, res, next) => {
    try {
        const result = await (0, testimonial_service_1.getAllTestimonials)();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getTestimonials = getTestimonials;
//# sourceMappingURL=testimonial.controller.js.map