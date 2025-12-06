"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolio = void 0;
const project_service_1 = require("../services/project.service");
const getPortfolio = async (req, res, next) => {
    try {
        const result = await (0, project_service_1.getPortfolioProjects)();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getPortfolio = getPortfolio;
//# sourceMappingURL=portfolio.controller.js.map