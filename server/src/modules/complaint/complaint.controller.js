import Complaint from './complaint.model.js';
import TicketHistory from './ticketHistory.model.js';
import { sendTicketConfirmation } from '../../services/email.service.js';
import { notifyCustomerViaTelegram } from '../../services/telegram.service.js';

const generateTicketId = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  return `NTS-${year}-${String(count + 1).padStart(5, '0')}`;
};

export const createComplaint = async (req, res, next) => {
  try {
    const ticket_id = await generateTicketId();
    
    const sla_due_at = new Date();
    sla_due_at.setHours(sla_due_at.getHours() + 48);

    const complaint = new Complaint({
      ...req.body,
      ticket_id,
      status: 'Pending',
      sla_due_at
    });
    await complaint.save();

    const history = new TicketHistory({
      ticket_id,
      action: 'status_change',
      to_status: 'Pending',
      note: 'Complaint registered successfully',
      is_public: true
    });
    await history.save();

    if (complaint.customer_email) {
      sendTicketConfirmation(complaint).catch(err => console.error(err));
    }

    res.status(201).json({ message: 'Complaint registered', ticket_id });
  } catch (err) {
    next(err);
  }
};

export const trackComplaint = async (req, res, next) => {
  try {
    const { ticket_id } = req.params;
    const complaint = await Complaint.findOne({ ticket_id });
    if (!complaint) return res.status(404).json({ message: 'Ticket not found' });
    
    const history = await TicketHistory.find({ ticket_id, is_public: true }).sort({ timestamp: -1 });
    
    res.json({ complaint, history });
  } catch (err) {
    next(err);
  }
};

export const listComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ created_at: -1 }).populate('assigned_to', 'name email');
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note, is_public } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Ticket not found' });
    
    const from_status = complaint.status;
    complaint.status = status;
    if (status === 'Resolved') complaint.resolved_at = new Date();
    if (status === 'Closed') complaint.closed_at = new Date();
    await complaint.save();

    const history = new TicketHistory({
      ticket_id: complaint.ticket_id,
      action: 'status_change',
      from_status,
      to_status: status,
      performed_by: req.user.id,
      note,
      is_public
    });
    await history.save();

    notifyCustomerViaTelegram(complaint, `Your ticket status has been updated to: **${status}**\n\nNote: ${note}`).catch(err => console.error(err));

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    next(err);
  }
};

export const assignTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Ticket not found' });
    
    complaint.assigned_to = assigned_to;
    await complaint.save();

    const history = new TicketHistory({
      ticket_id: complaint.ticket_id,
      action: 'assignment',
      performed_by: req.user.id,
      note: `Ticket assigned`,
      is_public: false
    });
    await history.save();

    notifyCustomerViaTelegram(complaint, `Your ticket has been assigned to a support agent.`).catch(err => console.error(err));

    res.json({ message: 'Ticket assigned', complaint });
  } catch (err) {
    next(err);
  }
};
