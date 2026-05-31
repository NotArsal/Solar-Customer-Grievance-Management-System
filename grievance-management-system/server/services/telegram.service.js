import TelegramBot from 'node-telegram-bot-api';
import Complaint from '../models/Complaint.js';

// Enabled polling: true so the bot actively fetches messages without needing a public HTTPS webhook
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('✅ Telegram Bot is running in polling mode...');

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (!text) return;

    if (text === '/start') {
      await bot.sendMessage(chatId, 'Welcome to NatureTek Solar Support! Use /raise to register a complaint or /track <TicketID> to check status.');
    } else if (text === '/raise') {
      await bot.sendMessage(chatId, 'To raise a complaint, please use our web portal at https://grievance.natureteksolar.com');
    } else if (text.startsWith('/track')) {
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
  } catch (error) {
    console.error('Telegram Bot Error:', error);
  }
});

// Mock webhook handler so the existing Express route doesn't break
export const handleTelegramWebhook = async (req, res) => {
  res.sendStatus(200);
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
