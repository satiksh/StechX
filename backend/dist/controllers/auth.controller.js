"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await (0, auth_service_1.registerUser)(name, email, password, role);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map