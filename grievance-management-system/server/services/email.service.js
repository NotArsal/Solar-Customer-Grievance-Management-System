import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export const sendTicketConfirmation = async (ticket) => {
  try {
    await transporter.sendMail({
      from: '"NatureTek Solar Support" <' + process.env.EMAIL_USER + '>',
      to: ticket.customer_email,
      subject: `Complaint Registered — Ticket ${ticket.ticket_id}`,
      html: `
        <h2>Complaint Registered</h2>
        <p>Dear ${ticket.customer_name},</p>
        <p>Your complaint regarding <strong>${ticket.product_type}</strong> has been registered.</p>
        <p><strong>Ticket ID:</strong> ${ticket.ticket_id}</p>
        <p>You can track the status on our portal.</p>
        <p>Regards,<br>Nature Tek Solar</p>
      `
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
};
