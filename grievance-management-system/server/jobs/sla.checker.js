import cron from 'node-cron';
import Complaint from '../models/Complaint.js';

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running SLA checker cron job...');
  try {
    const breached = await Complaint.find({
      status: { $in: ['Pending', 'In-Progress', 'On-Hold'] },
      sla_due_at: { $lt: new Date() },
      is_sla_breached: false
    });

    for (const ticket of breached) {
      ticket.is_sla_breached = true;
      await ticket.save();
      console.log(`SLA Breached for Ticket: ${ticket.ticket_id}`);
    }
  } catch (err) {
    console.error('SLA Checker Error:', err);
  }
});
