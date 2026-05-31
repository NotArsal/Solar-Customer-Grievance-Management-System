import express from 'express';
import { login, sendOTP, verifyOTP } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

export default router;
