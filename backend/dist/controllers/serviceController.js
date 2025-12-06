"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceBySlug = exports.getServices = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const getServices = async (_req, res) => {
    try {
        const services = await prismaClient_1.prisma.service.findMany({
            orderBy: { createdAt: 'asc' },
        });
        res.status(200).json(services);
    }
    catch (error) {
        console.error('getServices error:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};
exports.getServices = getServices;
const getServiceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const service = await prismaClient_1.prisma.service.findUnique({
            where: { slug },
        });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(service);
    }
    catch (error) {
        console.error('getServiceBySlug error:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
};
exports.getServiceBySlug = getServiceBySlug;
//# sourceMappingURL=serviceController.js.map