import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Complaint from './complaint.model.js';
import TicketHistory from './ticketHistory.model.js';
import User from '../user/user.model.js';
import Category from '../routing/category.model.js';
import { sendTicketConfirmation } from '../../services/email.service.js';
import { notifyCustomerViaTelegram } from '../../services/telegram.service.js';

const generateTicketId = async () => {
  const year = new Date().getFullYear();
  // Generate a 6-character random alphanumeric string for infinite scale uniqueness
  const uniquePart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NTS-${year}-${uniquePart}`;
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
  const categoryDoc = await Category.findOne({ name: category, is_active: true });
  if (!categoryDoc) {
    res.status(400);
    throw new Error('Invalid or inactive category selected');
  }

  const sla_due_at = new Date();
  sla_due_at.setHours(sla_due_at.getHours() + categoryDoc.sla_hours);

  const priority = categoryDoc.priority;

  // Auto-Assign based on routing department
  let assigned_to = null;
  let staffMember = await User.findOne({ 
      role: 'employee', 
      specialization: categoryDoc.assigned_department, 
      is_active: true 
  }).sort({ activeTicketsCount: 1 });

  // Fallback: If no staff found for that specific department, assign to any active employee with least tickets
  if (!staffMember) {
      staffMember = await User.findOne({ 
          role: 'employee', 
          is_active: true 
      }).sort({ activeTicketsCount: 1 });
  }

  if (staffMember) {
      assigned_to = staffMember._id;
      staffMember.activeTicketsCount += 1;
      await staffMember.save();
  }

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
  const complaint = await Complaint.findOne({ ticket_id });
  if (!complaint) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  const history = await TicketHistory.find({ ticket_id, is_public: true }).sort({ timestamp: -1 });
  res.json({ complaint, history });
});

export const listComplaints = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user?.role === 'customer') {
    query = { customer_id: req.user.id };
  } else if (req.user?.role === 'employee') {
    query = { assigned_to: req.user.id };
  }
  
  const complaints = await Complaint.find(query)
    .sort({ created_at: -1 })
    .populate('assigned_to', 'name email')
    .lean();
  res.json(complaints);
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
  if (status === 'unresolved') {
    complaint.closed_at = new Date();
    if (complaint.assigned_to) {
      const staffMember = await User.findById(complaint.assigned_to);
      if (staffMember && staffMember.activeTicketsCount > 0) {
        staffMember.activeTicketsCount -= 1;
        await staffMember.save();
      }
    }
  }
  await Complaint.findByIdAndUpdate(id, {
    $set: {
      status: complaint.status,
      resolved_at: complaint.resolved_at,
      closed_at: complaint.closed_at
    }
  });

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

  // Handle active count updates
  if (complaint.assigned_to && complaint.assigned_to.toString() !== assignedToId) {
    const oldStaff = await User.findById(complaint.assigned_to);
    if (oldStaff && oldStaff.activeTicketsCount > 0) {
      oldStaff.activeTicketsCount -= 1;
      await oldStaff.save();
    }
  }
  
  if (assignedToId && (!complaint.assigned_to || complaint.assigned_to.toString() !== assignedToId)) {
    const newStaff = await User.findById(assignedToId);
    if (newStaff) {
      newStaff.activeTicketsCount += 1;
      await newStaff.save();
    }
  }
  
  await Complaint.findByIdAndUpdate(id, {
    $set: {
      assigned_to: assignedToId,
      reassignment_request: { is_requested: false, reason: '' }
    }
  });

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
  });

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
  
  // Recalculate SLA based on new priority (Optional but logical, doing a rough estimate or leaving it unchanged. Let's just update priority).
  // Standardizing hours for overridden priority if we don't have category context: Critical: 12, High: 24, Medium: 72, Low: 168
  let newHours = 72;
  if (priority === 'High') newHours = 24;
  else if (priority === 'Critical') newHours = 12;
  else if (priority === 'Low') newHours = 168;

  const newSla = new Date();
  newSla.setHours(newSla.getHours() + newHours);
  complaint.sla_due_at = newSla;

  await Complaint.findByIdAndUpdate(id, {
    $set: {
      priority,
      sla_due_at: newSla
    }
  });

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
