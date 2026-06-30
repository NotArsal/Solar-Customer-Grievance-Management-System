import mongoose from 'mongoose';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import Complaint from './complaint.model.js';
import TicketHistory from './ticketHistory.model.js';
import Counter from './counter.model.js';
import User from '../user/user.model.js';
import Category from '../routing/category.model.js';
import { sendTicketConfirmation, sendStatusUpdateEmail } from '../../services/email.service.js';
import { notifyCustomerViaTelegram } from '../../services/telegram.service.js';

export const generateTicketId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: 'ticket_seq' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  // If this is the very first ticket, we want to start from 0 if the user requested NTS-0000-0000.
  // Wait, the increment returns seq: 1 first time. If we want 0-based:
  const seqNum = counter.seq - 1;
  const zeroPadded = seqNum.toString().padStart(4, '0');
  return `NTS-0000-${zeroPadded}`;
};

export const createComplaint = asyncHandler(async (req, res) => {
  const {
    customer_name,
    customer_phone,
    customer_email,
    invoice_no,
    product_type,
    category,
    subject,
    description,
    attachments,
    source
  } = req.body;

  if (!customer_name || !category || !subject || !description) {
    res.status(400);
    throw new Error('Please provide all required fields (customer_name, category, subject, description)');
  }

  const ticket_id = await generateTicketId();

  // Find routing category
  // Search by both name and assigned_department to correctly route duplicate names (e.g., "Other")
  const categoryDoc = await Category.findOne({ 
    name: category, 
    assigned_department: product_type, 
    is_active: true 
  }).lean();
  if (!categoryDoc) {
    res.status(400);
    throw new Error('Invalid or inactive category selected');
  }

  const sla_due_at = new Date();
  sla_due_at.setHours(sla_due_at.getHours() + categoryDoc.sla_hours);

  const priority = categoryDoc.priority;

  // Auto-Assign based on routing department or fallback to any active employee
  const staffMember = await User.findOne({ 
      role: 'employee', 
      specialization: categoryDoc.assigned_department, 
      is_active: true 
  }).sort({ activeTicketsCount: 1 }) || await User.findOne({ 
      role: 'employee', 
      is_active: true 
  }).sort({ activeTicketsCount: 1 });

  const assigned_to = staffMember ? staffMember._id : null;

  const customer_id = req.user && req.user.role === 'customer' ? req.user.id : null;

  const complaint = new Complaint({
    customer_id,
    customer_name,
    customer_phone,
    customer_email,
    invoice_no,
    product_type, // can still be kept if needed for legacy or general grouping
    category,
    category_ref: categoryDoc._id,
    subject,
    description,
    attachments,
    priority,
    source,
    ticket_id,
    status: 'pending',
    assigned_to,
    sla_due_at
  });
  await complaint.save();

  if (assigned_to) {
      await User.updateOne({ _id: assigned_to }, { $inc: { activeTicketsCount: 1 } });
  }

  const history = new TicketHistory({
    ticket_id,
    action: 'status_change',
    to_status: 'pending',
    note: 'Complaint registered successfully',
    is_public: true
  });
  await history.save();

  if (assigned_to) {
    const assignmentHistory = new TicketHistory({
      ticket_id,
      action: 'assignment',
      performed_by: assigned_to,
      note: `Ticket auto-assigned to department: ${categoryDoc.assigned_department}`,
      is_public: false
    });
    await assignmentHistory.save();
  }

  if (complaint.customer_email) {
    sendTicketConfirmation(complaint).catch(err => console.error(err));
  }

  res.status(201).json({ message: 'Complaint registered', ticket_id });
});

export const trackComplaint = asyncHandler(async (req, res) => {
  const { ticket_id } = req.params;
  
  if (!/^NTS-\d{4}-\d{4}$/.test(String(ticket_id))) {
    res.status(400);
    throw new Error('Invalid ticket ID format');
  }

  const [complaint, history] = await Promise.all([
    Complaint.findOne({ ticket_id: String(ticket_id) }).populate('assigned_to', 'name email').lean(),
    TicketHistory.find({ ticket_id: String(ticket_id), is_public: true })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('performed_by', 'name email')
      .lean()
  ]);

  if (!complaint) {
    res.status(404);
    throw new Error('Ticket not found');
  }
    
  res.json({ complaint, history });
});

export const listComplaints = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user?.role === 'customer') {
    query = { customer_id: req.user.id };
  } else if (req.user?.role === 'employee') {
    query = { assigned_to: req.user.id };
  }
  
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assigned_to', 'name email')
      .lean(),
    Complaint.countDocuments(query)
  ]);
  
  res.json({
    complaints,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, is_public } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid ticket ID format');
  }
  
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  const from_status = complaint.status;
  complaint.status = status;
  if (status === 'resolved') complaint.resolved_at = new Date();
  if (status === 'unresolved') complaint.closed_at = new Date();

  // If transitioning to a terminal state from a non-terminal state
  const isTerminal = (s) => ['resolved', 'unresolved', 'closed'].includes(s);
  
  if (isTerminal(status) && !isTerminal(from_status) && complaint.assigned_to) {
    await User.updateOne(
      { _id: complaint.assigned_to, activeTicketsCount: { $gt: 0 } },
      { $inc: { activeTicketsCount: -1 } }
    );
  }

  await complaint.save();

  const history = new TicketHistory({
    ticket_id: complaint.ticket_id,
    action: 'status_change',
    from_status,
    to_status: status,
    performed_by: req.user.id,
    note,
    is_public: is_public !== undefined ? is_public : true
  });
  await history.save();

  notifyCustomerViaTelegram(complaint, `Your ticket status has been updated to: **${status}**\n\nNote: ${note}`).catch(err => console.error(err));
  if (complaint.customer_email) {
    sendStatusUpdateEmail(complaint, status, note).catch(err => console.error(err));
  }

  res.json({ message: 'Status updated', complaint });
});

export const assignTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid ticket ID format');
  }
  
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const assignedToId = assigned_to === '' ? null : assigned_to;

  if (assignedToId) {
    const newStaff = await User.findById(assignedToId);
    if (!newStaff || !['employee', 'admin'].includes(newStaff.role)) {
      res.status(400);
      throw new Error('Invalid assignment target: User must be an employee or admin');
    }
  }

  const currentAssignedStr = complaint.assigned_to?.toString() || null;
  
  if (currentAssignedStr === assignedToId) {
    return res.json({ message: 'Ticket is already assigned to this user', complaint });
  }

  if (currentAssignedStr) {
    await User.updateOne({ _id: complaint.assigned_to, activeTicketsCount: { $gt: 0 } }, { $inc: { activeTicketsCount: -1 } });
  }
  
  if (assignedToId) {
    await User.updateOne({ _id: assignedToId }, { $inc: { activeTicketsCount: 1 } });
  }
  
  complaint.assigned_to = assignedToId;
  complaint.reassignment_request = { is_requested: false, reason: '' };
  await complaint.save();

  const history = new TicketHistory({
    ticket_id: complaint.ticket_id,
    action: 'assignment',
    performed_by: req.user.id,
    note: `Ticket manually reassigned`,
    is_public: false
  });
  await history.save();

  res.json({ message: 'Ticket assigned', complaint });
});

export const requestReassignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  if (!complaint.assigned_to || complaint.assigned_to.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Cannot request reassignment for a ticket not assigned to you');
  }

  await Complaint.findByIdAndUpdate(id, {
    $set: { reassignment_request: { is_requested: true, reason } }
  }, { runValidators: true });

  const history = new TicketHistory({
    ticket_id: complaint.ticket_id,
    action: 'note',
    performed_by: req.user.id,
    note: `Reassignment requested: ${reason}`,
    is_public: false
  });
  await history.save();

  res.json({ message: 'Reassignment requested successfully' });
});

export const overridePriority = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { priority, reason } = req.body;
  
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const oldPriority = complaint.priority;
  complaint.priority = priority;
  
  // Standardizing hours for overridden priority if we don't have category context
  const prioritySlaMap = { Low: 168, Medium: 72, High: 24, Critical: 12 };
  const newHours = prioritySlaMap[priority] || 72;

  const newSla = new Date();
  newSla.setHours(newSla.getHours() + newHours);
  complaint.sla_due_at = newSla;

  await Complaint.findByIdAndUpdate(id, {
    $set: {
      priority,
      sla_due_at: newSla
    }
  }, { runValidators: true });

  const history = new TicketHistory({
    ticket_id: complaint.ticket_id,
    action: 'priority_change',
    performed_by: req.user.id,
    note: `Priority overridden from ${oldPriority} to ${priority}. Reason: ${reason}`,
    is_public: false
  });
  await history.save();

  res.json({ message: 'Priority overridden successfully' });
});
