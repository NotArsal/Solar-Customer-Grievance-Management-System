import express from 'express';
import { getDashboardStats } from './report.controller.js';
import { authMiddleware, roleMiddleware } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, roleMiddleware(['admin', 'superadmin']), getDashboardStats);

export default router;
