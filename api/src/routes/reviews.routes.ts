import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  leaveReview,
  getUserReviews,
  getMyReviews,
} from '../controllers/reviewController';

const router = Router();

// Reviews
router.post('/', authenticate, leaveReview);
router.get('/user/:userId', getUserReviews);
router.get('/my', authenticate, getMyReviews);

export default router;
