import TelegramBot from 'node-telegram-bot-api';
import Complaint from '../modules/complaint/complaint.model.js';
import TicketHistory from '../modules/complaint/ticketHistory.model.js';
import { generateTicketId } from '../modules/complaint/complaint.controller.js';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const isDummyToken = !TELEGRAM_TOKEN || TELEGRAM_TOKEN.includes('dummy') || TELEGRAM_TOKEN === '1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let bot = null;

if (!isDummyToken) {
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  if (webhookUrl) {
    bot = new TelegramBot(TELEGRAM_TOKEN);
    bot.setWebHook(webhookUrl).catch(err => console.error('Telegram webhook setup error:', err.message));
    console.log(`✅ Telegram Bot is running in Webhook mode (URL: ${webhookUrl})`);
  } else {
    bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    console.log('✅ Telegram Bot is running in polling mode...');
  }
  
  bot.setMyCommands([
    { command: '/start', description: 'Start the bot and see instructions' },
    { command: '/raise', description: 'Raise a new complaint' },
    { command: '/track', description: 'Track an existing ticket (e.g. /track NTS-1234)' },
    { command: '/cancel', description: 'Cancel current complaint registration' }
  ]).catch(err => console.error('Telegram command setup error:', err.message));
} else {
  console.log('⚠️ Telegram Bot disabled (dummy token detected).');
}

// In-memory session store for multi-step conversations
const sessions = new Map();

// Session Cleanup (TTL: 15 minutes) to prevent memory leaks from abandoned chats
const SESSION_TTL_MS = 15 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [chatId, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TTL_MS) {
      sessions.delete(chatId);
      if (bot) bot.sendMessage(chatId, "⏱️ Your complaint registration session has expired due to inactivity. Please type /raise to start over.", { reply_markup: { remove_keyboard: true } });
    }
  }
}, 60 * 1000); // Check every minute

// State Dispatcher for the conversational flow
const stepHandlers = {
  'NAME': async (chatId, text, session, bot) => {
    session.data.customer_name = text || 'Customer';
    session.step = 'PHONE';
    return bot.sendMessage(chatId, "📱 Great! Now, please provide your **Mobile Number**.", { parse_mode: 'Markdown' });
  },
  'PHONE': async (chatId, text, session, bot) => {
    session.data.customer_phone = text || 'N/A';
    session.step = 'EMAIL';
    return bot.sendMessage(chatId, "📧 Got it. Please enter your **Email Address**.", { parse_mode: 'Markdown' });
  },
  'EMAIL': async (chatId, text, session, bot) => {
    session.data.customer_email = text || 'N/A';
    session.step = 'PRODUCT';
    const opts = {
      reply_markup: {
        keyboard: [[{ text: 'Solar Panel' }, { text: 'Inverter' }], [{ text: 'Battery' }, { text: 'Service' }]],
        one_time_keyboard: true,
        resize_keyboard: true
      },
      parse_mode: 'Markdown'
    };
    return bot.sendMessage(chatId, "⚡ What **product** is this regarding?", opts);
  },
  'PRODUCT': async (chatId, text, session, bot) => {
    session.data.product_type = text || 'Other';
    session.step = 'CATEGORY';
    const opts = {
      reply_markup: {
        keyboard: [[{ text: 'Product Defect' }, { text: 'Installation Issue' }], [{ text: 'Service Delay' }, { text: 'Billing' }]],
        one_time_keyboard: true,
        resize_keyboard: true
      },
      parse_mode: 'Markdown'
    };
    return bot.sendMessage(chatId, "🏷️ What is the **issue category**?", opts);
  },
  'CATEGORY': async (chatId, text, session, bot) => {
    session.data.category = text || 'General';
    session.step = 'SUBJECT';
    const opts = { reply_markup: { remove_keyboard: true }, parse_mode: 'Markdown' };
    return bot.sendMessage(chatId, "📝 Please provide a short **Subject** for the issue (e.g., Inverter showing red light).", opts);
  },
  'SUBJECT': async (chatId, text, session, bot) => {
    session.data.subject = text || 'No Subject';
    session.step = 'DESCRIPTION';
    return bot.sendMessage(chatId, "🗣️ Please provide a **detailed description** of the issue.", { parse_mode: 'Markdown' });
  },
  'DESCRIPTION': async (chatId, text, session, bot) => {
    session.data.description = text || 'No description provided';
    session.step = 'ATTACHMENTS';
    const opts = {
      reply_markup: {
        keyboard: [[{ text: 'Skip' }]],
        one_time_keyboard: true,
        resize_keyboard: true
      },
      parse_mode: 'Markdown'
    };
    return bot.sendMessage(chatId, "📸 Would you like to attach a **photo or video** of the issue?\n\nIf yes, please send it now. Otherwise, tap **Skip**.", opts);
  },
  'ATTACHMENTS': async (chatId, text, session, bot, msg) => {
    try {
      let fileId = null;
      if (msg.photo) fileId = msg.photo[msg.photo.length - 1].file_id;
      else if (msg.video) fileId = msg.video.file_id;
      else if (msg.document) fileId = msg.document.file_id;

      if (fileId) {
        const file = await bot.getFile(fileId);
        const apiUrl = process.env.API_URL || 'http://localhost:5000';
        session.data.attachments = [`${apiUrl}/v1/media/telegram?file_path=${file.file_path}`];
      }
    } catch (err) {
      console.error('Error fetching file from Telegram:', err);
    }

    try {
      const opts = { reply_markup: { remove_keyboard: true } };
      bot.sendMessage(chatId, "⏳ Submitting your complaint...", opts);
      
      const ticket_id = await generateTicketId();
      
      const newComplaint = new Complaint({
        ...session.data,
        ticket_id,
        status: 'pending',
        source: 'telegram',
        telegram_chat_id: chatId
      });
      await newComplaint.save();

      const history = new TicketHistory({
        ticket_id,
        action: 'status_change',
        to_status: 'pending',
        note: 'Complaint registered via Telegram',
        is_public: true
      });
      await history.save();

      sessions.delete(chatId);
      return bot.sendMessage(chatId, `✅ **Complaint Registered Successfully!**\n\n🎟️ Your Ticket ID is: \`${ticket_id}\`\n\nWe will notify you right here when the status updates!`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(err);
      sessions.delete(chatId);
      return bot.sendMessage(chatId, "❌ Sorry, an error occurred while saving your complaint. Please try again later or use the website.", { reply_markup: { remove_keyboard: true } });
    }
  }
};

if (bot) {
  bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    // Extract text from standard message or from media caption
    const text = msg.text?.trim() || msg.caption?.trim();
    const hasMedia = !!(msg.photo || msg.video || msg.document);

    // If there's no text and no media, ignore
    if (!text && !hasMedia) return;

    // Handle Cancel Command globally
    if (text === '/cancel') {
      if (sessions.has(chatId)) {
        sessions.delete(chatId);
        return bot.sendMessage(chatId, '❌ Complaint registration cancelled.', { reply_markup: { remove_keyboard: true } });
      } else {
        return bot.sendMessage(chatId, 'There is no active registration to cancel.');
      }
    }

    // Check if user is in an active session
    const session = sessions.get(chatId);
    
    if (session) {
      session.lastActivity = Date.now();
      const handler = stepHandlers[session.step];
      if (handler) {
        return handler(chatId, text, session, bot, msg);
      }
      return;
    }

    // Normal Command Routing (No active session)
    if (text === '/start') {
      await bot.sendMessage(chatId, 'Welcome to NatureTek Solar Support! ☀️\n\nUse /raise to register a new complaint directly here.\nUse /track <TicketID> to check your status.');
    } else if (text === '/raise') {
      sessions.set(chatId, { step: 'NAME', data: {}, lastActivity: Date.now() });
      await bot.sendMessage(chatId, "Let's register a new complaint. You can type /cancel at any time to abort.\n\nFirst, please reply with your **Full Name**.", { parse_mode: 'Markdown' });
    } else if (text?.startsWith('/track')) {
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
}

// Webhook handler
export const handleTelegramWebhook = async (req, res) => {
  if (bot && req.body) {
    bot.processUpdate(req.body);
  }
  res.sendStatus(200);
};

// Outbound Notification Service
export const notifyCustomerViaTelegram = async (ticket, message) => {
  if (bot && ticket.source === 'telegram' && ticket.telegram_chat_id) {
    try {
      await bot.sendMessage(ticket.telegram_chat_id, `🔔 **Ticket Update (${ticket.ticket_id})**\n\n${message}`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Error sending telegram message', err);
    }
  }
};
