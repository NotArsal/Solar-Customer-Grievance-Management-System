import TelegramBot from 'node-telegram-bot-api';
import Complaint from '../models/Complaint.js';
import TicketHistory from '../models/TicketHistory.js';

// Enabled polling: true so the bot actively fetches messages
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('✅ Telegram Bot is running in polling mode...');

// In-memory session store for multi-step conversations
const sessions = new Map();

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (!text) return;

    // Handle Cancel Command globally
    if (text === '/cancel') {
      if (sessions.has(chatId)) {
        sessions.delete(chatId);
        return bot.sendMessage(chatId, '❌ Complaint registration cancelled.');
      } else {
        return bot.sendMessage(chatId, 'There is no active registration to cancel.');
      }
    }

    // Check if user is in an active session
    const session = sessions.get(chatId);
    
    if (session) {
      const step = session.step;
      
      if (step === 'NAME') {
        session.data.customer_name = text;
        session.step = 'PHONE';
        return bot.sendMessage(chatId, "📱 Great! Now, please provide your **Mobile Number**.");
      } else if (step === 'PHONE') {
        session.data.customer_phone = text;
        session.step = 'EMAIL';
        return bot.sendMessage(chatId, "📧 Got it. Please enter your **Email Address**.");
      } else if (step === 'EMAIL') {
        session.data.customer_email = text;
        session.step = 'PRODUCT';
        // Provide a custom keyboard for easier selection
        const opts = {
          reply_markup: {
            keyboard: [[{ text: 'Solar Panel' }, { text: 'Inverter' }], [{ text: 'Battery' }, { text: 'Service' }]],
            one_time_keyboard: true,
            resize_keyboard: true
          }
        };
        return bot.sendMessage(chatId, "⚡ What **product** is this regarding?", opts);
      } else if (step === 'PRODUCT') {
        session.data.product_type = text;
        session.step = 'CATEGORY';
        const opts = {
          reply_markup: {
            keyboard: [[{ text: 'Product Defect' }, { text: 'Installation Issue' }], [{ text: 'Service Delay' }, { text: 'Billing' }]],
            one_time_keyboard: true,
            resize_keyboard: true
          }
        };
        return bot.sendMessage(chatId, "🏷️ What is the **issue category**?", opts);
      } else if (step === 'CATEGORY') {
        session.data.category = text;
        session.step = 'SUBJECT';
        const opts = { reply_markup: { remove_keyboard: true } };
        return bot.sendMessage(chatId, "📝 Please provide a short **Subject** for the issue (e.g., Inverter showing red light).", opts);
      } else if (step === 'SUBJECT') {
        session.data.subject = text;
        session.step = 'DESCRIPTION';
        return bot.sendMessage(chatId, "🗣️ Finally, please provide a **detailed description** of the issue.");
      } else if (step === 'DESCRIPTION') {
        session.data.description = text;
        
        // Save to DB
        try {
          bot.sendMessage(chatId, "⏳ Submitting your complaint...");
          
          const year = new Date().getFullYear();
          const count = await Complaint.countDocuments();
          const ticket_id = `NTS-${year}-${String(count + 1).padStart(5, '0')}`;
          
          const newComplaint = new Complaint({
            ...session.data,
            ticket_id,
            status: 'Pending',
            source: 'telegram',
            telegram_chat_id: chatId
          });
          await newComplaint.save();

          const history = new TicketHistory({
            ticket_id,
            action: 'status_change',
            to_status: 'Pending',
            note: 'Complaint registered via Telegram',
            is_public: true
          });
          await history.save();

          sessions.delete(chatId);
          return bot.sendMessage(chatId, `✅ **Complaint Registered Successfully!**\n\n🎟️ Your Ticket ID is: \`${ticket_id}\`\n\nWe will notify you right here when the status updates!`, { parse_mode: 'Markdown' });
        } catch (err) {
          console.error(err);
          sessions.delete(chatId);
          return bot.sendMessage(chatId, "❌ Sorry, an error occurred while saving your complaint. Please try again later or use the website.");
        }
      }
      return;
    }

    // Normal Command Routing (No active session)
    if (text === '/start') {
      await bot.sendMessage(chatId, 'Welcome to NatureTek Solar Support! ☀️\n\nUse /raise to register a new complaint directly here.\nUse /track <TicketID> to check your status.');
    } else if (text === '/raise') {
      sessions.set(chatId, { step: 'NAME', data: {} });
      await bot.sendMessage(chatId, "Let's register a new complaint. You can type /cancel at any time to abort.\n\nFirst, please reply with your **Full Name**.");
    } else if (text.startsWith('/track')) {
      const ticketId = text.split(' ')[1];
      if (!ticketId) {
        await bot.sendMessage(chatId, '⚠️ Usage: /track <TicketID>');
      } else {
        const ticket = await Complaint.findOne({ ticket_id: ticketId });
        if (!ticket) {
          await bot.sendMessage(chatId, '❌ Ticket not found. Please verify your Ticket ID.');
        } else {
          await bot.sendMessage(chatId, `📋 **Ticket:** ${ticket.ticket_id}\n📌 **Status:** ${ticket.status}\n📝 **Subject:** ${ticket.subject}`, { parse_mode: 'Markdown' });
        }
      }
    } else {
      await bot.sendMessage(chatId, 'I am a simple support bot! Try /start, /raise, or /track <TicketID>.');
    }
  } catch (error) {
    console.error('Telegram Bot Error:', error);
  }
});

// Mock webhook handler
export const handleTelegramWebhook = async (req, res) => {
  res.sendStatus(200);
};

// Outbound Notification Service
export const notifyCustomerViaTelegram = async (ticket, message) => {
  if (ticket.source === 'telegram' && ticket.telegram_chat_id) {
    try {
      await bot.sendMessage(ticket.telegram_chat_id, `🔔 **Ticket Update (${ticket.ticket_id})**\n\n${message}`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Error sending telegram message', err);
    }
  }
};
