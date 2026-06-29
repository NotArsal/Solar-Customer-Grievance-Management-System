import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, customerRegister, sendOTP, verifyOTP, getEmployees } from './auth.controller.js';
import { authMiddleware, roleMiddleware } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

// Strict rate limiter for authentication routes to prevent credential stuffing 
// and OTP brute-force attacks. 5 attempts per 15 minutes is aggressive but necessary 
// to secure customer accounts and prevent SMS/email gateway spam.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: { status: 'error', message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', customerRegister);
router.post('/login', authLimiter, login);
router.post('/otp/send', authLimiter, sendOTP);
router.post('/otp/verify', authLimiter, verifyOTP);
router.get('/employees', authMiddleware, roleMiddleware(['admin', 'employee']), getEmployees);

export default router;
