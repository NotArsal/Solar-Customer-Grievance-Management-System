import Complaint from '../models/Complaint.js';
import TicketHistory from '../models/TicketHistory.js';

const generateTicketId = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  return `NTS-${year}-${String(count + 1).padStart(5, '0')}`;
};

export const createComplaint = async (req, res) => {
  try {
    const ticket_id = await generateTicketId();
    const complaint = new Complaint({
      ...req.body,
      ticket_id,
      status: 'Pending'
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

    res.status(201).json({ message: 'Complaint registered', ticket_id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating complaint', error: err.message });
  }
};

export const trackComplaint = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const complaint = await Complaint.findOne({ ticket_id });
    if (!complaint) return res.status(404).json({ message: 'Ticket not found' });
    
    const history = await TicketHistory.find({ ticket_id, is_public: true }).sort({ timestamp: -1 });
    
    res.json({ complaint, history });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking complaint', error: err.message });
  }
};

export const listComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ created_at: -1 }).populate('assigned_to', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Error listing complaints', error: err.message });
  }
};

export const updateStatus = async (req, res) => {
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

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};
