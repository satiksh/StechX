import { Router } from 'express';
import { register, login, googleLogin, logout, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

export default router;
