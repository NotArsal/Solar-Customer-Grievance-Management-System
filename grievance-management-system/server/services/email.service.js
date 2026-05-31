import nodemailer from 'nodemailer';

let transporter;

const initTransporter = async () => {
  // Use real credentials if provided, otherwise fallback to Ethereal
  if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('example') && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('✉️  Using Ethereal Email for testing (mock emails)');
    } catch (err) {
      console.error('Failed to create test email account:', err);
    }
  }
};

initTransporter();

export const sendTicketConfirmation = async (ticket) => {
  try {
    if (!transporter) await initTransporter();
    
    const info = await transporter.sendMail({
      from: '"NatureTek Solar Support" <support@natureteksolar.com>',
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

    if (transporter.options.host === 'smtp.ethereal.email') {
      console.log("📨 Test Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email send error:', error);
  }
};
