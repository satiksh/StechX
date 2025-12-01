import { Router } from 'express';
import { getAdminDashboard } from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.get('/dashboard', authenticate, authorizeRoles(UserRole.Admin), getAdminDashboard);

export default router;
