import express from 'express';
import { createComplaint, trackComplaint, listComplaints, updateStatus } from '../controllers/complaint.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createComplaint);
router.get('/track/:ticket_id', trackComplaint);

// Protected routes
router.get('/', authMiddleware, listComplaints);
router.patch('/:id/status', authMiddleware, updateStatus);

export default router;
