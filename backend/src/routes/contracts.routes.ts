import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createContract,
  getMyContracts,
  getContractById,
  updateContractStatus,
  updateProgress,
} from '../controllers/contractController';

const router = Router();

// Protected routes
router.post('/', authenticate, createContract);
router.get('/', authenticate, getMyContracts);
router.get('/:contractId', authenticate, getContractById);
router.put('/:contractId/status', authenticate, updateContractStatus);
router.put('/:contractId/progress', authenticate, updateProgress);

export default router;
