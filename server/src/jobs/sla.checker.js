import cron from 'node-cron';
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

    for (const ticket of breached) {
      ticket.is_sla_breached = true;
      await ticket.save();
      console.log(`SLA Breached for Ticket: ${ticket.ticket_id}`);

      // Notify admins
      for (const admin of admins) {
        await Notification.create({
          user_id: admin._id,
          ticket_id: ticket.ticket_id,
          type: 'SLA_BREACH',
          message: `SLA BREACHED: Ticket ${ticket.ticket_id} has exceeded its resolution time.`
        });
      }

      // Notify assigned employee
      if (ticket.assigned_to) {
        await Notification.create({
          user_id: ticket.assigned_to,
          ticket_id: ticket.ticket_id,
          type: 'SLA_BREACH',
          message: `SLA BREACHED: Your ticket ${ticket.ticket_id} has exceeded its resolution time.`
        });
      }
    }
  } catch (err) {
    console.error('SLA Checker Error:', err);
  }
};

// Run immediately on startup
checkSLA();

// Then run every hour
cron.schedule('0 * * * *', checkSLA);
