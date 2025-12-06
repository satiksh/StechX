"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTestimonials = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTestimonials = async () => {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return { testimonials };
};
exports.getAllTestimonials = getAllTestimonials;
//# sourceMappingURL=testimonial.service.js.map