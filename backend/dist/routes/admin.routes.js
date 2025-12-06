"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.get('/dashboard', auth_1.authenticate, (0, auth_1.authorizeRoles)(types_1.UserRole.ADMIN), admin_controller_1.getAdminDashboard);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map