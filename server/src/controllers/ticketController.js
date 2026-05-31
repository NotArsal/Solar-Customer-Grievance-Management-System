import Ticket from '../models/Ticket.js';

// Helper function to generate unique Ticket IDs (e.g., NT-8431)
const generateTicketId = async () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  const ticketId = `NT-${randomNum}`;
  
  // Check if it exists just to be safe
  const exists = await Ticket.findOne({ ticketId });
  if (exists) return generateTicketId(); // Recursively try again if collision
  
  return ticketId;
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private (Customer)
export const createTicket = async (req, res) => {
  try {
    const { category, subject, description, plantReference, attachments } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const ticketId = await generateTicketId();

    const ticket = await Ticket.create({
      ticketId,
      customer: req.user._id, // Got this from our Auth Middleware!
      category,
      subject,
      description,
      plantReference,
      attachments: attachments || []
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    res.status(500).json({ message: 'Server error creating ticket' });
  }
};

// @desc    Get all tickets for the logged-in customer
// @route   GET /api/tickets/my-tickets
// @access  Private (Customer)
export const getMyTickets = async (req, res) => {
  try {
    // Find tickets where the customer ID matches the logged-in user
    // Sort by newest first
    const tickets = await Ticket.find({ customer: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Fetch Tickets Error:', error);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
};