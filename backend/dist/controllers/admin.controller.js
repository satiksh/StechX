"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = void 0;
const user_service_1 = require("../services/user.service");
const getAdminDashboard = async (req, res, next) => {
    try {
        const users = await (0, user_service_1.getAllUsers)();
        const projects = await (0, user_service_1.getAllProjects)();
        const applications = await (0, user_service_1.getAllApplications)();
        res.status(200).json({
            users,
            projects,
            applications,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminDashboard = getAdminDashboard;
//# sourceMappingURL=admin.controller.js.map