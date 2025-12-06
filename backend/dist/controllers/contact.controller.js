"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = void 0;
const contact_service_1 = require("../services/contact.service");
const submitContact = async (req, res, next) => {
    try {
        const { name, email, projectType, budget, message } = req.body;
        const result = await (0, contact_service_1.createContactRequest)({
            name,
            email,
            projectType,
            budget,
            message,
        });
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.submitContact = submitContact;
//# sourceMappingURL=contact.controller.js.map