"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplication = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createApplication = async (position, portfolioUrl, experience, talentId) => {
    const application = await prisma.application.create({
        data: {
            position,
            portfolioUrl,
            experience,
            status: client_1.ApplicationStatus.Submitted,
            // talentId is optional; will be null if not provided
            talentId: talentId || null,
        },
    });
    return application;
};
exports.createApplication = createApplication;
//# sourceMappingURL=application.service.js.map