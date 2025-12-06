"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestimonials = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const getTestimonials = async (_req, res) => {
    try {
        const testimonials = await prismaClient_1.prisma.testimonial.findMany({
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        serviceId: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(testimonials);
    }
    catch (error) {
        console.error('getTestimonials error:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
};
exports.getTestimonials = getTestimonials;
//# sourceMappingURL=testimonialController.js.map