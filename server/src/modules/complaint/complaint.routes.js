import express from 'express';
import { createComplaint, trackComplaint, listComplaints, updateStatus, assignTicket, requestReassignment, overridePriority } from './complaint.controller.js';
import rateLimit from 'express-rate-limit';
import { authMiddleware, roleMiddleware } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

const complaintLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { status: 'error', message: 'Too many complaints from this IP, please try again after 15 minutes.' }
});

router.post('/', authMiddleware, complaintLimiter, createComplaint); // Now requires auth to associate customer_id
router.get('/:ticket_id/track', trackComplaint);

// Protected routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'employee', 'customer']), listComplaints);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'employee']), updateStatus);
router.patch('/:id/assign', authMiddleware, roleMiddleware(['admin', 'superadmin']), assignTicket);
router.patch('/:id/reassign-request', authMiddleware, roleMiddleware(['employee']), requestReassignment);
router.patch('/:id/priority', authMiddleware, roleMiddleware(['admin', 'superadmin']), overridePriority);

export default router;
