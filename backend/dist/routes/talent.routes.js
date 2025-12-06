"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const talent_controller_1 = require("../controllers/talent.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const application_validator_1 = require("../validators/application.validator");
const router = (0, express_1.Router)();
// Public route: anyone can apply as talent
router.post('/apply', (0, validate_1.validate)(application_validator_1.applicationSchema), talent_controller_1.applyAsTalent);
// Protected route: only authenticated users can view their profile
router.get('/profile', auth_1.authenticate, talent_controller_1.getTalentProfileController);
exports.default = router;
//# sourceMappingURL=talent.routes.js.map