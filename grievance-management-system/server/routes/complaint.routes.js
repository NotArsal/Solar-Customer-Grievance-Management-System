import express from 'express';
import { createComplaint, trackComplaint, listComplaints, updateStatus, assignTicket } from '../controllers/complaint.controller.js';
import rateLimit from 'express-rate-limit';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

const complaintLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { status: 'error', message: 'Too many complaints from this IP, please try again after 15 minutes.' }
});

router.post('/', complaintLimiter, createComplaint);
router.get('/:ticket_id/track', trackComplaint);

// Protected routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'employee']), listComplaints);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'employee']), updateStatus);
router.patch('/:id/assign', authMiddleware, roleMiddleware(['admin', 'employee']), assignTicket);

export default router;
