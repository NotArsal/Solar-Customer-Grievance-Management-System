import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from './category.controller.js';
import { authMiddleware, roleMiddleware } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

// Publicly accessible for the customer portal dropdown
router.get('/', getCategories);

// Admin only for management
router.post('/', authMiddleware, roleMiddleware(['admin', 'superadmin']), createCategory);
router.patch('/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'superadmin']), deleteCategory);

export default router;
