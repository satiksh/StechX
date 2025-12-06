"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateApplicationStatus = exports.adminGetApplications = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const updateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.ApplicationStatus),
});
const adminGetApplications = async (_req, res) => {
    try {
        const applications = await prismaClient_1.prisma.application.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(applications);
    }
    catch (error) {
        console.error('adminGetApplications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};
exports.adminGetApplications = adminGetApplications;
const adminUpdateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const data = updateApplicationStatusSchema.parse(req.body);
        const application = await prismaClient_1.prisma.application.update({
            where: { id },
            data: {
                status: data.status,
            },
        });
        res.status(200).json(application);
    }
    catch (error) {
        console.error('adminUpdateApplicationStatus error:', error);
        res.status(400).json({ error: error.message || 'Failed to update application status' });
    }
};
exports.adminUpdateApplicationStatus = adminUpdateApplicationStatus;
//# sourceMappingURL=adminApplicationController.js.map