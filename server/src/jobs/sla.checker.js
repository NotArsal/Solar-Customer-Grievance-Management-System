import Complaint from '../modules/complaint/complaint.model.js';
import Notification from '../modules/notification/notification.model.js';
import User from '../modules/user/user.model.js';

export const checkSLA = async () => {
  console.log('Running SLA checker...');
  try {
    const breached = await Complaint.find({
      status: { $in: ['pending', 'in-progress'] },
      sla_due_at: { $lt: new Date() },
      is_sla_breached: false
    });

    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });

    const notifications = [];
    const ticketIds = [];

    for (const ticket of breached) {
      ticketIds.push(ticket._id);
      console.log(`SLA Breached for Ticket: ${ticket.ticket_id}`);

      for (const admin of admins) {
        notifications.push({
          user_id: admin._id,
          ticket_id: ticket.ticket_id,
          type: 'SLA_BREACH',
          message: `SLA BREACHED: Ticket ${ticket.ticket_id} has exceeded its resolution time.`
        });
      }

      if (ticket.assigned_to) {
        notifications.push({
          user_id: ticket.assigned_to,
          ticket_id: ticket.ticket_id,
          type: 'SLA_BREACH',
          message: `SLA BREACHED: Your ticket ${ticket.ticket_id} has exceeded its resolution time.`
        });
      }
    }

    if (ticketIds.length > 0) {
      await Complaint.updateMany({ _id: { $in: ticketIds } }, { $set: { is_sla_breached: true } });
    }
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error('SLA Checker Error:', err);
  }
};

export const initJobs = () => {
  // Run immediately on startup
  checkSLA();

  // Then run every 10 minutes
  setInterval(checkSLA, 10 * 60 * 1000);
};
