import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  submitProposal,
  getJobProposals,
  getMyProposals,
  updateProposalStatus,
  withdrawProposal,
} from '../controllers/proposalController';

const router = Router();

// Protected routes
router.post('/', authenticate, submitProposal);
router.get('/job/:jobId', getJobProposals);
router.get('/my', authenticate, getMyProposals);
router.put('/:proposalId/status', authenticate, updateProposalStatus);
router.delete('/:proposalId', authenticate, withdrawProposal);

export default router;
