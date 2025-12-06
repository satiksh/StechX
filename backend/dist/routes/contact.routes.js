"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const validate_1 = require("../middleware/validate");
const contact_validator_1 = require("../validators/contact.validator");
const router = (0, express_1.Router)();
router.post('/', (0, validate_1.validate)(contact_validator_1.contactSchema), contact_controller_1.submitContact);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map