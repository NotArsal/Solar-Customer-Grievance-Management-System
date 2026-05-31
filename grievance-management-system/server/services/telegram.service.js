import TelegramBot from 'node-telegram-bot-api';
import Complaint from '../models/Complaint.js';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export const handleTelegramWebhook = async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.sendStatus(200);

    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (text === '/start') {
      await bot.sendMessage(chatId, 'Welcome to NatureTek Solar Support! Use /raise to register a complaint or /track <TicketID> to check status.');
    } else if (text === '/raise') {
      await bot.sendMessage(chatId, 'To raise a complaint, please use our web portal at https://grievance.natureteksolar.com (Full Telegram conversation flow coming soon!)');
    } else if (text?.startsWith('/track')) {
      const ticketId = text.split(' ')[1];
      if (!ticketId) {
        await bot.sendMessage(chatId, 'Usage: /track <TicketID>');
      } else {
        const ticket = await Complaint.findOne({ ticket_id: ticketId });
        if (!ticket) {
          await bot.sendMessage(chatId, '❌ Ticket not found.');
        } else {
          await bot.sendMessage(chatId, `📋 Ticket: ${ticket.ticket_id}\nStatus: ${ticket.status}`);
        }
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    res.sendStatus(500);
  }
};

export const notifyCustomerViaTelegram = async (ticket, message) => {
  if (ticket.source === 'telegram' && ticket.telegram_chat_id) {
    try {
      await bot.sendMessage(ticket.telegram_chat_id, message);
    } catch (err) {
      console.error('Error sending telegram message', err);
    }
  }
};
