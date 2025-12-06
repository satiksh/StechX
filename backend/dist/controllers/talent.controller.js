"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTalentProfileController = exports.applyAsTalent = void 0;
const application_service_1 = require("../services/application.service");
const applyAsTalent = async (req, res, next) => {
    try {
        const { position, portfolioUrl, experience } = req.body;
        const application = await (0, application_service_1.createApplication)(position, portfolioUrl, experience);
        res.status(201).json({
            message: 'Application submitted successfully',
            application,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.applyAsTalent = applyAsTalent;
const getTalentProfileController = async (_req, res, _next) => {
    res.status(200).json({ message: 'Talent profile placeholder' });
};
exports.getTalentProfileController = getTalentProfileController;
//# sourceMappingURL=talent.controller.js.map