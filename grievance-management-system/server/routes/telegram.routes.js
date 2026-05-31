import express from 'express';
import { handleTelegramWebhook } from '../services/telegram.service.js';

const router = express.Router();

router.post('/webhook', handleTelegramWebhook);

export default router;
