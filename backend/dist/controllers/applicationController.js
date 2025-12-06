"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTalent = exports.applyClient = exports.submitContact = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const client_1 = require("@prisma/client");
const applicationValidators_1 = require("../validators/applicationValidators");
const submitContact = async (req, res) => {
    try {
        const data = applicationValidators_1.contactSchema.parse(req.body);
        // Represent a general contact as an Application with type CLIENT_PROJECT but without serviceId/budget/experience.
        const application = await prismaClient_1.prisma.application.create({
            data: {
                type: client_1.ApplicationType.CLIENT_PROJECT,
                name: data.name,
                email: data.email,
                message: data.message,
                status: client_1.ApplicationStatus.SUBMITTED,
            },
        });
        res.status(201).json({ ok: true, applicationId: application.id });
    }
    catch (error) {
        console.error('submitContact error:', error);
        res.status(400).json({ error: error.message || 'Failed to submit contact' });
    }
};
exports.submitContact = submitContact;
const applyClient = async (req, res) => {
    try {
        const data = applicationValidators_1.clientApplicationSchema.parse(req.body);
        const application = await prismaClient_1.prisma.application.create({
            data: {
                type: client_1.ApplicationType.CLIENT_PROJECT,
                serviceId: data.serviceId ?? null,
                name: data.name,
                email: data.email,
                message: data.message,
                budget: data.budget ?? null,
                status: client_1.ApplicationStatus.SUBMITTED,
            },
        });
        res.status(201).json({ ok: true, applicationId: application.id });
    }
    catch (error) {
        console.error('applyClient error:', error);
        res.status(400).json({ error: error.message || 'Failed to submit client application' });
    }
};
exports.applyClient = applyClient;
const applyTalent = async (req, res) => {
    try {
        const data = applicationValidators_1.talentApplicationSchema.parse(req.body);
        const application = await prismaClient_1.prisma.application.create({
            data: {
                type: client_1.ApplicationType.TALENT,
                name: data.name,
                email: data.email,
                message: data.message,
                experience: data.experience ?? null,
                status: client_1.ApplicationStatus.SUBMITTED,
            },
        });
        res.status(201).json({ ok: true, applicationId: application.id });
    }
    catch (error) {
        console.error('applyTalent error:', error);
        res.status(400).json({ error: error.message || 'Failed to submit talent application' });
    }
};
exports.applyTalent = applyTalent;
//# sourceMappingURL=applicationController.js.map