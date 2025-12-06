"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplications = exports.getAllProjects = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            role: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            country: true,
            portfolioUrl: true,
            skills: true,
        },
    });
    return users;
};
exports.getAllUsers = getAllUsers;
const getAllProjects = async () => {
    const projects = await prisma.project.findMany({
        include: {
            client: {
                select: {
                    name: true,
                    email: true,
                },
            },
            talent: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
    return projects;
};
exports.getAllProjects = getAllProjects;
const getAllApplications = async () => {
    const applications = await prisma.application.findMany({
        include: {
            talent: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
    return applications;
};
exports.getAllApplications = getAllApplications;
//# sourceMappingURL=user.service.js.map