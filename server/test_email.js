import './src/services/email.service.js';
import { sendTicketConfirmation } from './src/services/email.service.js';

async function testEmail() {
    console.log("Testing email sending...");
    await sendTicketConfirmation({
        customer_email: "test@example.com",
        customer_name: "Test User",
        product_type: "Solar Panel",
        ticket_id: "TEST-123"
    });
}

setTimeout(testEmail, 2000); // Wait for initTransporter to finish
