"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteProject = exports.adminUpdateProject = exports.adminCreateProject = exports.adminGetProjectById = exports.adminGetProjects = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const adminProjectValidators_1 = require("../validators/adminProjectValidators");
const adminGetProjects = async (_req, res) => {
    try {
        const projects = await prismaClient_1.prisma.project.findMany({
            include: { service: true, testimonials: true },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('adminGetProjects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
exports.adminGetProjects = adminGetProjects;
const adminGetProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prismaClient_1.prisma.project.findUnique({
            where: { id },
            include: { service: true, testimonials: true },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    }
    catch (error) {
        console.error('adminGetProjectById error:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
exports.adminGetProjectById = adminGetProjectById;
const adminCreateProject = async (req, res) => {
    try {
        const data = adminProjectValidators_1.createProjectSchema.parse(req.body);
        const project = await prismaClient_1.prisma.project.create({
            data: {
                title: data.title,
                slug: data.slug,
                serviceId: data.serviceId,
                thumbnailUrl: data.thumbnailUrl,
                imageUrls: data.imageUrls,
                summary: data.summary,
                caseStudy: data.caseStudy,
                isFeatured: data.isFeatured ?? false,
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error('adminCreateProject error:', error);
        res.status(400).json({ error: error.message || 'Failed to create project' });
    }
};
exports.adminCreateProject = adminCreateProject;
const adminUpdateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const data = adminProjectValidators_1.updateProjectSchema.parse(req.body);
        const project = await prismaClient_1.prisma.project.update({
            where: { id },
            data,
        });
        res.status(200).json(project);
    }
    catch (error) {
        console.error('adminUpdateProject error:', error);
        res.status(400).json({ error: error.message || 'Failed to update project' });
    }
};
exports.adminUpdateProject = adminUpdateProject;
const adminDeleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.prisma.project.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('adminDeleteProject error:', error);
        res.status(400).json({ error: error.message || 'Failed to delete project' });
    }
};
exports.adminDeleteProject = adminDeleteProject;
//# sourceMappingURL=adminProjectController.js.map