"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const project_validator_1 = require("../validators/project.validator");
const router = (0, express_1.Router)();
router.post('/hire-talent', auth_1.authenticate, (0, validate_1.validate)(project_validator_1.createProjectSchema), client_controller_1.hireTalent);
router.get('/projects', auth_1.authenticate, client_controller_1.getClientProjectsController);
exports.default = router;
//# sourceMappingURL=client.routes.js.map