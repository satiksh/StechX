import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCurrentUser,
  getUserById,
  updateProfile,
  getDashboardStats,
} from '../controllers/userController';

const router = express.Router();

// Protected routes (require authentication)
router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateProfile);
router.get('/stats', authenticate, getDashboardStats);

// Public routes
router.get('/:userId', getUserById);

export default router;
