import express from 'express';
import { login, sendOTP, verifyOTP, getEmployees } from './auth.controller.js';
import { authMiddleware, roleMiddleware } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.get('/employees', authMiddleware, roleMiddleware(['admin', 'employee']), getEmployees);

export default router;
