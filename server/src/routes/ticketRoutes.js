import express from 'express';
import { createTicket, getMyTickets } from '../controllers/ticketController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All ticket routes require the user to be logged in
router.use(verifyToken); 

// Route: POST /api/tickets -> Creates a new ticket
router.post('/', createTicket);

// Route: GET /api/tickets/my-tickets -> Gets the customer's tickets
router.get('/my-tickets', getMyTickets);

export default router;