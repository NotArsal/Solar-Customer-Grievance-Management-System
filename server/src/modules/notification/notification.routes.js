import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from './notification.controller.js';
import { authMiddleware } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
