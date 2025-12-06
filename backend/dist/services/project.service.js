"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientProjects = exports.createProject = exports.getPortfolioProjects = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
const getPortfolioProjects = async () => {
    const projects = await prisma.project.findMany({
        where: {
            status: 'Completed',
        },
        include: {
            client: {
                select: {
                    name: true,
                },
            },
        },
    });
    return { projects };
};
exports.getPortfolioProjects = getPortfolioProjects;
const createProject = async (clientId, projectData) => {
    const client = await prisma.user.findUnique({
        where: { id: clientId },
    });
    if (!client) {
        throw new errorHandler_1.AppError(404, 'Client not found');
    }
    const project = await prisma.project.create({
        data: {
            clientId,
            title: projectData.title,
            description: projectData.description,
            type: projectData.type,
            budget: projectData.budget,
            attachments: projectData.attachments || [],
            status: 'Pending',
        },
    });
    return { projectId: project.id };
};
exports.createProject = createProject;
const getClientProjects = async (clientId) => {
    const client = await prisma.user.findUnique({
        where: { id: clientId },
    });
    if (!client) {
        throw new errorHandler_1.AppError(404, 'Client not found');
    }
    const projects = await prisma.project.findMany({
        where: { clientId },
        include: {
            talent: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return { projects };
};
exports.getClientProjects = getClientProjects;
//# sourceMappingURL=project.service.js.map