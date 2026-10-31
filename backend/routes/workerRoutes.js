import express from 'express';
import {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  toggleWorkerStatus,
} from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getWorkers).post(protect, createWorker);
router.route('/:id').get(protect, getWorkerById).put(protect, updateWorker).delete(protect, deleteWorker);
router.patch('/:id/status', protect, toggleWorkerStatus);

export default router;