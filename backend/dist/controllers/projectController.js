"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectBySlug = exports.getProjects = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const getProjects = async (req, res) => {
    try {
        const { service } = req.query;
        const where = {};
        if (typeof service === 'string') {
            where.service = {
                slug: service,
            };
        }
        const projects = await prismaClient_1.prisma.project.findMany({
            where,
            include: {
                service: true,
                testimonials: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('getProjects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
exports.getProjects = getProjects;
const getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const project = await prismaClient_1.prisma.project.findUnique({
            where: { slug },
            include: {
                service: true,
                testimonials: true,
            },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    }
    catch (error) {
        console.error('getProjectBySlug error:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
exports.getProjectBySlug = getProjectBySlug;
//# sourceMappingURL=projectController.js.map