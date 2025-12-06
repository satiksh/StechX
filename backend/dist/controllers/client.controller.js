"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientProjectsController = exports.hireTalent = void 0;
const project_service_1 = require("../services/project.service");
const hireTalent = async (req, res, next) => {
    try {
        const { clientId, project } = req.body;
        const result = await (0, project_service_1.createProject)(clientId, project);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.hireTalent = hireTalent;
const getClientProjectsController = async (req, res, next) => {
    try {
        const { clientId } = req.query;
        const result = await (0, project_service_1.getClientProjects)(clientId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getClientProjectsController = getClientProjectsController;
//# sourceMappingURL=client.controller.js.map