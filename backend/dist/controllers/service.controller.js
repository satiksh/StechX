"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = void 0;
const service_service_1 = require("../services/service.service");
const getServices = async (req, res, next) => {
    try {
        const result = await (0, service_service_1.getAllServices)();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getServices = getServices;
//# sourceMappingURL=service.controller.js.map