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

// Public routes
router.get('/browse', getAllJobs);
router.get('/bookmarks', authenticate, getBookmarkedJobs);
router.get('/:jobId', getJobById);

// Protected routes (freelancer can browse, client can post)
router.post('/', authenticate, createJob);
router.post('/bookmark', authenticate, bookmarkJob);
router.delete('/:jobId/bookmark', authenticate, unbookmarkJob);

// Client routes
router.get('/my-jobs', authenticate, getMyJobs);
router.put('/:jobId', authenticate, updateJob);
router.delete('/:jobId', authenticate, deleteJob);

export default router;
