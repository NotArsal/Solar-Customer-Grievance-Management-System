import express from 'express';
import { syncUser } from '../controllers/authController.js';

const router = express.Router();

// Route: POST /api/auth/sync
// Purpose: Save a newly registered Firebase user into MongoDB
router.post('/sync', syncUser);

export default router;