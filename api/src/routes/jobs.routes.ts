import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  bookmarkJob,
  unbookmarkJob,
  getBookmarkedJobs,
} from '../controllers/jobController';

const router = Router();

// Public routes - specific routes FIRST
router.get('/browse', getAllJobs);
router.get('/my-jobs', authenticate, getMyJobs);
router.get('/bookmarks', authenticate, getBookmarkedJobs);

// Parameterized routes - AFTER specific ones
router.get('/:jobId', getJobById);

// Create and modify routes
router.post('/', authenticate, createJob);
router.put('/:jobId', authenticate, updateJob);
router.delete('/:jobId', authenticate, deleteJob);
router.post('/:jobId/bookmark', authenticate, bookmarkJob);
router.delete('/:jobId/bookmark', authenticate, unbookmarkJob);

export default router;
