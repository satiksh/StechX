"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteTestimonial = exports.adminUpdateTestimonial = exports.adminCreateTestimonial = exports.adminGetTestimonials = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const adminTestimonialValidators_1 = require("../validators/adminTestimonialValidators");
const adminGetTestimonials = async (_req, res) => {
    try {
        const testimonials = await prismaClient_1.prisma.testimonial.findMany({
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(testimonials);
    }
    catch (error) {
        console.error('adminGetTestimonials error:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
};
exports.adminGetTestimonials = adminGetTestimonials;
const adminCreateTestimonial = async (req, res) => {
    try {
        const data = adminTestimonialValidators_1.createTestimonialSchema.parse(req.body);
        const testimonial = await prismaClient_1.prisma.testimonial.create({
            data: {
                clientName: data.clientName,
                clientRole: data.clientRole,
                quote: data.quote,
                projectId: data.projectId ?? null,
            },
        });
        res.status(201).json(testimonial);
    }
    catch (error) {
        console.error('adminCreateTestimonial error:', error);
        res.status(400).json({ error: error.message || 'Failed to create testimonial' });
    }
};
exports.adminCreateTestimonial = adminCreateTestimonial;
const adminUpdateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const data = adminTestimonialValidators_1.updateTestimonialSchema.parse(req.body);
        const testimonial = await prismaClient_1.prisma.testimonial.update({
            where: { id },
            data,
        });
        res.status(200).json(testimonial);
    }
    catch (error) {
        console.error('adminUpdateTestimonial error:', error);
        res.status(400).json({ error: error.message || 'Failed to update testimonial' });
    }
};
exports.adminUpdateTestimonial = adminUpdateTestimonial;
const adminDeleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.prisma.testimonial.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('adminDeleteTestimonial error:', error);
        res.status(400).json({ error: error.message || 'Failed to delete testimonial' });
    }
};
exports.adminDeleteTestimonial = adminDeleteTestimonial;
//# sourceMappingURL=adminTestimonialController.js.map