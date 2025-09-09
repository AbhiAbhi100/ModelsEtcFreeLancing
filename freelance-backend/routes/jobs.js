import express from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import {
  createJob,
  listJobs,
  getJob,
  applyToJob,
  respondToProposal,
  updateJobStatus,
  myJobs,
  myApplications
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/', protect, requireRole('client'), createJob);
router.get('/', listJobs);
router.get('/mine', protect, myJobs); // For clients to see jobs they posted
router.get('/applications', protect, requireRole('freelancer'), myApplications); // For freelancers to see jobs they applied to
router.get('/:id', getJob);
router.post('/:id/apply', protect, requireRole('freelancer'), applyToJob);
router.patch('/:id/proposals/:proposalId', protect, requireRole('client'), respondToProposal);
router.patch('/:id/status', protect, updateJobStatus);

export default router;