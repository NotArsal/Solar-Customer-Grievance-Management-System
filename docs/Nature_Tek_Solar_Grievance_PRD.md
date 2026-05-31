# Nature Tek Solar Pvt. Ltd.
## Customer Grievance Management System (CGMS)
### Product Requirements Document — v2.0

---

> **Company:** Nature Tek Solar Pvt. Ltd., Nashik, Maharashtra  
> **Website:** https://www.natureteksolar.com  
> **Prepared by:** Industry Project Team — VIT Pune, CSE-AI Div E Batch 3 (5 members)  
> **Version:** 2.0  
> **Date:** May 2026  
> **Status:** Draft — Awaiting Client Review  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Stakeholders & User Roles](#4-stakeholders--user-roles)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [System Architecture](#7-system-architecture)
8. [Tech Stack](#8-tech-stack)
9. [Database Schema](#9-database-schema)
10. [API Design](#10-api-design)
11. [Telegram Bot Integration](#11-telegram-bot-integration)
12. [Notification System](#12-notification-system)
13. [Key Screens & User Flows](#13-key-screens--user-flows)
14. [Ticket Lifecycle](#14-ticket-lifecycle)
15. [Dataset Requirements](#15-dataset-requirements)
16. [Project Plan & Milestones](#16-project-plan--milestones)
17. [Assumptions & Constraints](#17-assumptions--constraints)
18. [Future Enhancements — Phase 2](#18-future-enhancements--phase-2)
19. [Approval & Sign-Off](#19-approval--sign-off)

---

## 1. Executive Summary

Nature Tek Solar Pvt. Ltd. is a growing solar energy solutions provider based in Nashik, Maharashtra, offering solar panels, on-grid/hybrid inverters (Fujiyama), lithium batteries, and end-to-end installation services. As their customer base scales, the absence of a structured complaint-handling system has resulted in delayed resolutions, poor traceability, and declining post-sale customer satisfaction.

This PRD defines the complete requirements for a **Customer Grievance Management System (CGMS)** — a centralized, role-based web platform integrated into the Nature Tek Solar ecosystem. The system allows customers to raise grievances via a **web portal**, **email**, or directly through a **Telegram Bot**, and enables internal staff to track, assign, and resolve issues through structured dashboards.

**Key decisions confirmed for this version:**

| Decision | Choice | Rationale |
|---|---|---|
| Database | MongoDB (MERN Stack) | Flexible schema, team familiarity, array-friendly for attachments/comments |
| Customer Auth | OTP-based, no registration | Minimizes friction for non-tech-savvy customers |
| Primary Notification | Email (Nodemailer) | Free, reliable, zero infrastructure cost |
| Showcase Feature | Telegram Bot (two-way) | Free API, real-time, impressive for demo & academic evaluation |
| WhatsApp | Phase 2 (Official API) | Unofficial libs risk number ban; not safe for client's business number |
| Integration Method | Subdomain: `grievance.natureteksolar.com` | Avoids locked BoostKit platform limitations |

---

## 2. Problem Statement

Nature Tek Solar currently handles all customer complaints informally — via WhatsApp messages, phone calls, and email threads. This approach has no structure, no accountability, and no visibility.

| # | Problem | Current State | Business Impact |
|---|---|---|---|
| 1 | No ticket system | Complaints arrive on personal WhatsApp numbers | Lost complaints, zero traceability |
| 2 | No assignment | No employee is formally "responsible" for a complaint | Blame-shifting, delays |
| 3 | No status tracking | Customer has to keep calling to know what's happening | Poor customer experience |
| 4 | No SLA | No deadline defined for resolution | Complaints stay open indefinitely |
| 5 | No analytics | Management has no data on complaint trends | Cannot identify recurring product defects |
| 6 | No history | Past complaint records not maintained | Repeat issues not detected |

---

## 3. Objectives

- Digitize and centralize all customer complaint submission and tracking
- Auto-generate a unique Ticket ID (e.g., `NTS-2026-00123`) for every complaint
- Implement role-based access for **Admin**, **Employee**, and **Customer**
- Enable ticket **assignment, reassignment, and escalation** workflows
- Provide **real-time status visibility** to customers without requiring account creation
- Send automated **email notifications** at every status transition
- Offer a **Telegram Bot** as a conversational complaint channel (official feature)
- Generate **management-level analytics** on complaint frequency, resolution time, and defect patterns
- Deploy as a standalone portal at `grievance.natureteksolar.com` integrated via a button on the main site

---

## 4. Stakeholders & User Roles

### 4.1 Stakeholders

| Stakeholder | Type | Primary Interest |
|---|---|---|
| Nature Tek Solar Management | Client | Operational efficiency, accountability, analytics |
| Customer Service / Field Staff | End Users | Easy ticket management, mobile-friendly dashboard |
| Customers (homeowners, businesses) | External Users | Submit issues, track resolution without friction |
| System Administrator | Internal IT | User management, system configuration |
| VIT Pune Project Team (5 members) | Developers | Build, test, and deploy the system |

### 4.2 User Roles & Permissions

| Role | Permissions |
|---|---|
| **Customer** | Submit complaint (web or Telegram), track ticket via OTP, submit feedback/rating, close resolved ticket |
| **Employee** | View assigned tickets, update status, add comments, upload resolution proof, request reassignment |
| **Admin** | All employee permissions + assign/reassign tickets, manage users, configure SLAs, view analytics, export reports |
| **Super Admin** | All admin permissions + system-level configuration, manage admin accounts, full data export |

---

## 5. Functional Requirements

### FR-01 — Complaint Registration (Web Portal)

Customers access the grievance portal via `grievance.natureteksolar.com` or via a **"Raise a Complaint"** button on the main website.

**Form Fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Full Name | Text | Yes | |
| Mobile Number | 10-digit | Yes | Used for OTP-based tracking |
| Email Address | Email | Yes | Used for all notifications |
| Invoice / Order Number | Text | No | Helps link to product records |
| Product Type | Dropdown | Yes | Solar Panel / Inverter / Battery / Service / Other |
| Complaint Category | Dropdown | Yes | See categories in Section 15 |
| Subject | Text (max 100 chars) | Yes | Short title |
| Description | Textarea (max 1000 chars) | Yes | Detailed description |
| Attachments | File upload | No | Images/PDF, max 5MB, stored on ImgBB |

**On Submission:**
- Unique Ticket ID generated: `NTS-YYYY-XXXXX`
- Customer receives confirmation email with Ticket ID, category, and estimated resolution time (based on SLA)
- Ticket appears in Admin dashboard as **Pending**

---

### FR-02 — OTP-Based Ticket Tracking

Customers can check ticket status **without creating an account**.

**Flow:**
1. Customer visits `/track`
2. Enters Ticket ID + registered phone number
3. OTP sent to phone (via email as fallback)
4. On OTP verification: full ticket detail shown — status, assigned team, comments visible to customer, last updated timestamp

---

### FR-03 — Employee Dashboard

| Feature | Detail |
|---|---|
| Ticket List | All tickets assigned to the logged-in employee, sortable by priority, SLA deadline, date |
| Filter/Search | By status, product type, category, date range |
| Status Update | Change status with required comment (e.g., "Contacted customer, awaiting site visit") |
| Internal Notes | Notes not visible to customer; visible to all staff |
| Customer Comments | Visible to customer in their tracking view |
| Resolution Proof | Upload image or document as evidence of resolution |
| Reassignment Request | Request reassignment with a reason; goes to admin for approval |

---

### FR-04 — Admin Dashboard

| Feature | Detail |
|---|---|
| Master Ticket View | All tickets across the organisation with full filter options |
| Assignment | Assign unassigned tickets to specific employees |
| Reassignment | Reassign with escalation note |
| SLA Configuration | Set resolution time (hours) per complaint category |
| SLA Breach Alerts | Real-time alerts for tickets that have crossed their deadline |
| User Management | Add, edit, deactivate employee and admin accounts |
| Bulk Notifications | Send a service update broadcast to customers (e.g., "We are aware of inverter issues in your area") |

---

### FR-05 — Analytics & Reporting

| Metric | Description |
|---|---|
| KPI Cards | Total tickets, Open tickets, Resolved this week/month, Avg resolution time |
| Category Chart | Bar chart — complaints by category |
| Product Chart | Pie chart — complaints by product type |
| Trend Chart | Line chart — complaints raised vs resolved over time |
| SLA Performance | % tickets resolved within SLA deadline |
| Employee Performance | Tickets resolved per employee, avg close time |
| Export | Download filtered reports as CSV or PDF |

---

### FR-06 — Customer Feedback

After a ticket is marked **Resolved**, customer receives an email/Telegram message asking for feedback.

- 1–5 star rating
- Optional text comment
- Submitting feedback auto-moves ticket to **Closed**
- If no response within 7 days, ticket auto-closes

---

## 6. Non-Functional Requirements

| Attribute | Requirement |
|---|---|
| **Performance** | Page load < 2 seconds. API response < 500ms for 95th percentile |
| **Scalability** | Handle 500 concurrent users. Support 10,000+ tickets without degradation |
| **Availability** | 99.5% uptime. Scheduled maintenance communicated 24hrs in advance |
| **Security** | JWT-based auth, HTTPS enforced, input sanitization, RBAC on all routes |
| **Data Privacy** | Customer PII stored securely. Compliant with IT Act 2000 & DPDP Act 2023 |
| **Mobile Friendly** | Fully responsive — field staff primarily use mobile browsers |
| **Accessibility** | WCAG 2.1 AA for customer-facing portal |
| **Maintainability** | Modular codebase, README documentation, env-based config |
| **Backup** | Daily MongoDB Atlas automated backups. Recovery time < 4 hours |

---

## 7. System Architecture

### 7.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER TOUCHPOINTS                        │
│                                                                  │
│  natureteksolar.com  ──────────────────────────────────────────►│
│  (Button: "Raise a Complaint")                                   │
│                                    grievance.natureteksolar.com  │
│  Telegram Bot (@NatureTekSupportBot) ──────────────────────────►│
│  (Type: "My inverter has a fault")                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│                                                                  │
│   React.js + Tailwind CSS (Vite)                                 │
│                                                                  │
│   /            → Customer Portal (complaint form, tracker)       │
│   /employee    → Employee Dashboard                              │
│   /admin       → Admin Dashboard + Analytics                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│                                                                  │
│   Node.js + Express.js REST API                                  │
│   JWT Auth Middleware (role-based)                               │
│   OTP Service (email-based fallback)                             │
│   Telegram Webhook Handler                                       │
│   Notification Service (Nodemailer)                              │
│   File Upload Handler (ImgBB)                                    │
│   SLA Engine (cron job, runs hourly)                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│                                                                  │
│   MongoDB Atlas (Cloud)                                          │
│   Collections: complaints, users, ticket_history,               │
│                notifications, categories, sla_configs            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
         ┌──────────────┐    ┌──────────────────┐
         │    ImgBB     │    │ Telegram Bot API  │
         │ (File Store) │    │ (@BotFather token)│
         └──────────────┘    └──────────────────┘
```

### 7.2 Integration with natureteksolar.com

The existing website is hosted on BoostKit/WithFloats, a locked SaaS platform. Direct backend integration is not possible. The recommended strategy:

| Option | Method | Recommendation |
|---|---|---|
| **Option A** | Host CGMS at `grievance.natureteksolar.com` (subdomain) | ✅ **Recommended** |
| Option B | Embed as `<iframe>` widget on existing Support/Contact page | Fallback |
| Option C | Full website rebuild with native integration | Phase 2 |

**Option A Implementation:** The site admin adds a single button to the BoostKit site's contact or footer section:
```html
<a href="https://grievance.natureteksolar.com" target="_blank">
  Raise a Complaint
</a>
```

No code changes to the core platform. Zero technical risk for the client.

---

## 8. Tech Stack

| Layer | Technology | Version | Justification |
|---|---|---|---|
| **Frontend** | React.js + Vite | React 18 | Fast, component-based, SPA routing |
| **Styling** | Tailwind CSS | v3 | Rapid responsive UI, mobile-first |
| **Backend** | Node.js + Express.js | Node 20 LTS | Lightweight REST API |
| **Database** | MongoDB + Mongoose | MongoDB 7 | Flexible schema, arrays, nested docs |
| **Auth** | JWT + bcrypt | — | Stateless, secure, role-based |
| **OTP** | Nodemailer (email OTP) | — | Free, no external API needed |
| **Email** | Nodemailer + Gmail SMTP | — | Free for low volume |
| **Telegram Bot** | node-telegram-bot-api | v0.66 | Free Telegram API, two-way chat |
| **File Storage** | ImgBB | Free tier | Managed image/doc hosting |
| **Scheduler** | node-cron | — | SLA breach checks, auto-close jobs |
| **Hosting — Backend** | Render / Railway | Free tier | Managed Node.js, CI/CD from GitHub |
| **Hosting — Frontend** | Vercel | Free tier | CDN, instant deploys from GitHub |
| **Hosting — Database** | MongoDB Atlas | M0 Free | 512MB, sufficient for academic project |
| **Version Control** | GitHub | — | Team collaboration (5 members) |

---

## 9. Database Schema

### 9.1 Collections Overview

| Collection | Purpose |
|---|---|
| `complaints` | One document per grievance ticket — the core collection |
| `users` | Admin, employee accounts (customers are OTP-verified, not stored unless opted-in) |
| `ticket_history` | Immutable audit log of every status change and comment |
| `notifications` | Log of every email / Telegram message sent per ticket event |
| `categories` | Configurable complaint categories and sub-categories |
| `sla_configs` | Resolution time targets (in hours) per category |

---

### 9.2 `complaints` Collection

```js
{
  _id: ObjectId,
  ticket_id: String,          // "NTS-2026-00123" — unique, auto-generated

  // Customer Info
  customer_name: String,      // required
  customer_phone: String,     // required, 10-digit
  customer_email: String,     // required
  invoice_no: String,         // optional

  // Complaint Details
  product_type: String,       // Enum: ["Solar Panel","Inverter","Battery","Service","Other"]
  category: String,           // Ref → categories.name
  subject: String,            // max 100 chars
  description: String,        // max 1000 chars
  attachments: [String],      // Array of ImgBB URLs

  // Status & Assignment
  status: String,             // Enum: ["Pending","In-Progress","On-Hold","Escalated","Resolved","Unresolved","Closed"]
  priority: String,           // Enum: ["Low","Medium","High","Critical"]
  assigned_to: ObjectId,      // Ref → users._id (null if unassigned)

  // SLA
  sla_due_at: Date,           // Computed at creation: created_at + sla_configs[category].hours
  is_sla_breached: Boolean,   // Computed by cron job

  // Channel
  source: String,             // Enum: ["web","telegram","email"]
  telegram_chat_id: String,   // If raised via Telegram — for reply routing

  // Feedback
  customer_rating: Number,    // 1–5, set after resolution
  customer_feedback: String,  // Optional text after resolution

  // Timestamps
  created_at: Date,           // auto
  updated_at: Date,           // auto
  resolved_at: Date,          // set when status → Resolved
  closed_at: Date             // set when status → Closed
}
```

---

### 9.3 `ticket_history` Collection

```js
{
  _id: ObjectId,
  ticket_id: String,          // Ref → complaints.ticket_id
  action: String,             // "status_change" | "comment" | "assignment" | "escalation"
  from_status: String,        // Previous status (null for first entry)
  to_status: String,          // New status
  performed_by: ObjectId,     // Ref → users._id (or "system" for auto-actions)
  note: String,               // Visible to customer if is_public: true
  is_public: Boolean,         // false = internal note only
  timestamp: Date             // auto
}
```

---

### 9.4 `users` Collection

```js
{
  _id: ObjectId,
  name: String,               // required
  email: String,              // unique, required
  phone: String,              // required
  password_hash: String,      // bcrypt
  role: String,               // Enum: ["employee","admin","superadmin"]
  department: String,         // e.g., "Installation", "Sales", "Service"
  is_active: Boolean,         // soft delete
  created_at: Date,
  last_login: Date
}
```

---

### 9.5 `sla_configs` Collection

```js
{
  _id: ObjectId,
  category: String,           // Matches complaints.category
  resolution_hours: Number,   // Target resolution time
  priority_multipliers: {
    Low: Number,              // e.g., 1.5x
    Medium: Number,           // e.g., 1.0x
    High: Number,             // e.g., 0.75x
    Critical: Number          // e.g., 0.5x
  },
  updated_by: ObjectId,
  updated_at: Date
}
```

---

## 10. API Design

**Base URL:** `https://api.grievance.natureteksolar.com/v1`

All protected routes require `Authorization: Bearer <JWT>` header.

### 10.1 Complaints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/complaints` | Submit new complaint | Public |
| `GET` | `/complaints` | List all complaints (filterable) | Employee+ |
| `GET` | `/complaints/:id` | Get full ticket detail | Employee+ |
| `PATCH` | `/complaints/:id/status` | Update ticket status + note | Employee+ |
| `PATCH` | `/complaints/:id/assign` | Assign ticket to employee | Admin+ |
| `POST` | `/complaints/:id/comments` | Add comment to ticket | Employee+ |
| `POST` | `/complaints/:id/feedback` | Customer submits rating | Public (OTP) |
| `GET` | `/complaints/track/:ticket_id` | Get public status for customer | Public (OTP) |

### 10.2 Auth

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/login` | Login for employee/admin | Public |
| `POST` | `/auth/refresh` | Refresh JWT token | Authenticated |
| `POST` | `/auth/otp/send` | Send OTP to customer phone/email | Public |
| `POST` | `/auth/otp/verify` | Verify OTP, return short-lived token | Public |

### 10.3 Users (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | List all employees |
| `POST` | `/users` | Create employee account |
| `PATCH` | `/users/:id` | Update employee details |
| `DELETE` | `/users/:id` | Soft-delete (deactivate) employee |

### 10.4 Reports

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/reports/summary` | KPI cards for dashboard | Admin+ |
| `GET` | `/reports/trends` | Chart data (complaints over time) | Admin+ |
| `GET` | `/reports/sla` | SLA compliance report | Admin+ |
| `GET` | `/reports/export` | Export as CSV | Admin+ |

### 10.5 Telegram Webhook

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/telegram/webhook` | Receives all updates from Telegram (set via BotFather) |

---

## 11. Telegram Bot Integration

> This is an **official feature** of the CGMS, not a demo add-on.

### 11.1 Why Telegram over WhatsApp (unofficial libs)

| | Telegram Bot API | whatsapp-web.js / OpenWA |
|---|---|---|
| Cost | **Free, forever** | Free library, but risk-heavy |
| Risk | None | WhatsApp bans numbers using unofficial automation — the client's business number could be permanently banned |
| Official | Yes — Telegram Bot API is a published, supported API | No — reverse-engineered, against WhatsApp ToS |
| Setup time | ~1 hour | ~3 hours + brittle |
| Suitable for client handover | **Yes** | **No** |
| WhatsApp Official API | N/A | ₹0.85–1.20/conversation + business verification required |

**WhatsApp** is noted as a **Phase 2 feature** using the official WhatsApp Business API (Meta Cloud API) once the client completes business verification.

---

### 11.2 Bot Setup

```
1. Message @BotFather on Telegram
2. /newbot → Name: "NatureTek Support" → Username: @NatureTekSupportBot
3. Copy the token → add to .env as TELEGRAM_BOT_TOKEN
4. Set webhook: POST https://api.telegram.org/bot<TOKEN>/setWebhook
   Body: { url: "https://api.grievance.natureteksolar.com/v1/telegram/webhook" }
```

---

### 11.3 Bot Conversation Flow

```
Customer: /start
Bot: 👋 Welcome to NatureTek Solar Support!
     I can help you raise a complaint or track an existing one.
     
     Type:
     /raise   — Register a new complaint
     /track   — Track your existing complaint
     /help    — Show this menu again

─────────────────────────────────────────
Customer: /raise
Bot: Please share your registered mobile number:

Customer: 9876543210
Bot: Got it. What type of issue are you facing?
     1️⃣ Solar Panel
     2️⃣ Inverter / Battery
     3️⃣ Installation
     4️⃣ Billing / Subsidy
     5️⃣ Other

Customer: 2
Bot: Please describe your issue briefly:

Customer: My Fujiyama inverter is showing a red fault light since yesterday.
Bot: ✅ Complaint registered!

     🎫 Ticket ID: NTS-2026-00089
     📦 Category: Inverter / Battery
     ⏱️ Expected resolution: within 72 hours
     
     You'll receive updates here on Telegram.
     To track anytime, type /track NTS-2026-00089

─────────────────────────────────────────
Customer: /track NTS-2026-00089
Bot: 📋 Ticket: NTS-2026-00089
     Status: 🔄 In-Progress
     Assigned to: Service Team
     Last update: Technician scheduled for site visit tomorrow
     Updated: 2 hours ago
```

---

### 11.4 Backend Bot Handler (Node.js)

```js
// telegram.webhook.js
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Webhook handler — called by Express route POST /telegram/webhook
async function handleTelegramUpdate(update) {
  const msg = update.message;
  if (!msg) return;

  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (text === '/start') {
    return bot.sendMessage(chatId, welcomeMessage());
  }

  if (text === '/raise') {
    // Set user session state to "awaiting_phone"
    await setSession(chatId, { step: 'awaiting_phone' });
    return bot.sendMessage(chatId, 'Please share your registered mobile number:');
  }

  if (text?.startsWith('/track')) {
    const ticketId = text.split(' ')[1];
    if (!ticketId) return bot.sendMessage(chatId, 'Usage: /track <TicketID>');
    const ticket = await Complaint.findOne({ ticket_id: ticketId });
    if (!ticket) return bot.sendMessage(chatId, '❌ Ticket not found.');
    return bot.sendMessage(chatId, formatTicketStatus(ticket));
  }

  // Handle multi-step complaint registration flow
  await handleConversationStep(chatId, text, bot);
}

// When a ticket status changes, notify the customer if they raised via Telegram
async function notifyCustomerViaTelegram(ticket, message) {
  if (ticket.source === 'telegram' && ticket.telegram_chat_id) {
    await bot.sendMessage(ticket.telegram_chat_id, message);
  }
}
```

---

### 11.5 Auto-Categorization (Keyword Matching)

The bot uses simple keyword matching to pre-fill the complaint category based on the customer's free-text description. This can be upgraded to an ML classifier in Phase 2.

```js
const categoryKeywords = {
  'Inverter / Battery': ['inverter', 'red light', 'fault', 'battery', 'charging', 'no power', 'blink'],
  'Solar Panel':        ['panel', 'cracked', 'shading', 'dirt', 'output low', 'broken'],
  'Installation':       ['wiring', 'mounting', 'loose', 'installation', 'setup', 'cable'],
  'Billing / Subsidy':  ['bill', 'subsidy', 'invoice', 'payment', 'refund', 'overcharge'],
  'Service Delay':      ['delay', 'waiting', 'not arrived', 'no visit', 'pending since'],
};

function autoClassify(text) {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lower.includes(kw))) return category;
  }
  return 'Other';
}
```

---

## 12. Notification System

### 12.1 Notification Matrix

| Event | Email | Telegram | Who Receives |
|---|---|---|---|
| Ticket Raised | ✅ | ✅ (if via bot) | Customer |
| Ticket Assigned | ✅ | ✅ | Customer + Employee |
| Status → In-Progress | ✅ | ✅ | Customer |
| Status → On-Hold | ✅ | ✅ | Customer (with reason) |
| Status → Resolved | ✅ | ✅ + feedback request | Customer |
| SLA Breach Warning | ✅ | — | Employee + Admin |
| SLA Breached | ✅ | — | Admin |
| Feedback Received | — | — | Admin (dashboard) |
| Auto-Closed (7 days) | ✅ | ✅ | Customer |

### 12.2 Email Setup (Nodemailer)

```js
// notifications/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,    // e.g., support@natureteksolar.com
    pass: process.env.EMAIL_PASS,    // Gmail App Password (not main password)
  }
});

async function sendTicketConfirmation(ticket) {
  await transporter.sendMail({
    from: '"NatureTek Solar Support" <support@natureteksolar.com>',
    to: ticket.customer_email,
    subject: `Complaint Registered — Ticket ${ticket.ticket_id}`,
    html: ticketConfirmationTemplate(ticket)
  });
}
```

### 12.3 SLA Cron Job

```js
// jobs/sla.checker.js
const cron = require('node-cron');

// Runs every hour
cron.schedule('0 * * * *', async () => {
  const breached = await Complaint.find({
    status: { $in: ['Pending', 'In-Progress', 'On-Hold'] },
    sla_due_at: { $lt: new Date() },
    is_sla_breached: false
  });

  for (const ticket of breached) {
    ticket.is_sla_breached = true;
    await ticket.save();
    await notifyAdminSLABreach(ticket);
  }
});

// Auto-close resolved tickets after 7 days of no customer response
cron.schedule('0 9 * * *', async () => {  // Daily at 9 AM
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await Complaint.updateMany(
    { status: 'Resolved', resolved_at: { $lt: cutoff } },
    { status: 'Closed', closed_at: new Date() }
  );
});
```

---

## 13. Key Screens & User Flows

| Screen | User | Key Elements |
|---|---|---|
| **Complaint Form** | Customer | Multi-step, product selector, category dropdown, file upload, progress indicator |
| **Ticket Confirmation** | Customer | Ticket ID (copyable), ETA based on SLA, QR code to Telegram bot |
| **Status Tracker** | Customer | Enter Ticket ID + phone → OTP → timeline view of status history |
| **Employee Dashboard** | Employee | Ticket list with SLA countdown pills, priority badges, quick status update |
| **Ticket Detail** | Employee/Admin | Full complaint info, comment thread (internal/public toggle), status controls, attachment viewer |
| **Admin Master View** | Admin | All tickets with bulk assignment, SLA breach filter, employee workload overview |
| **Analytics Dashboard** | Admin | KPI cards, category/product/trend charts, SLA compliance %, export button |
| **User Management** | Admin | Employee list, add/edit/deactivate accounts, role assignment |
| **Feedback Screen** | Customer | Post-resolution star rating (1–5) + optional comment via web or Telegram |
| **Notification Config** | Admin | Edit email templates per event type, configure SLA hours per category |

---

## 14. Ticket Lifecycle

```
                    ┌─────────────┐
  Customer submits  │   PENDING   │ ← New ticket, unassigned
  ─────────────────►│             │
                    └──────┬──────┘
                           │ Admin assigns
                           ▼
                    ┌─────────────┐
                    │ IN-PROGRESS │ ← Employee working on it
                    └──────┬──────┘
                    ┌──────┴──────────────────┐
                    │                         │
                    ▼                         ▼
             ┌────────────┐           ┌─────────────┐
             │  ON-HOLD   │           │  ESCALATED  │
             │ (awaiting  │           │  (senior /  │
             │  customer) │           │  different  │
             └─────┬──────┘           │  dept)      │
                   │                  └──────┬──────┘
                   └──────────┬─────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌────────────┐     ┌─────────────┐
             │  RESOLVED  │     │ UNRESOLVED  │
             │            │     │ (cannot fix)│
             └─────┬──────┘     └─────────────┘
                   │ Customer confirms
                   │ OR 7 days no response
                   ▼
             ┌────────────┐
             │   CLOSED   │ ← Terminal state
             └────────────┘
```

| Status | Set By | Customer Notified |
|---|---|---|
| Pending | System (auto on creation) | Yes — confirmation email/Telegram |
| In-Progress | Admin / Employee | Yes |
| On-Hold | Employee (with reason) | Yes |
| Escalated | Employee / Admin | Yes — with new ETA |
| Resolved | Employee / Admin | Yes — with resolution note + feedback request |
| Unresolved | Admin | Yes — with explanation and next steps |
| Closed | Customer or System (auto) | Yes — closure summary |

---

## 15. Dataset Requirements

> This section is the **official data request** to the Nature Tek Solar coordinator.  
> Please prepare the following datasets as Excel/CSV files or via a shared Google Drive link.

---

### A. Employee / Staff Master Data

**File format:** `employees.csv`

| Column | Type | Required | Example |
|---|---|---|---|
| `employee_name` | String | Yes | Rajan Patil |
| `employee_code` | String | No | NTS-EMP-007 |
| `email` | Email | Yes | rajan.patil@natureteksolar.com |
| `mobile` | 10-digit | Yes | 9876543210 |
| `department` | String | Yes | Installation / Sales / Service |
| `role` | Enum | Yes | employee / admin |
| `reporting_manager` | String | No | Amit Shah |
| `join_date` | Date | No | 2024-03-01 |

---

### B. Product / Service Catalogue

**File format:** `products.csv`

| Column | Type | Required | Example |
|---|---|---|---|
| `product_name` | String | Yes | Fujiyama 540W Mono PERC Panel |
| `product_code` | String | No | FUJ-540-MONO |
| `category` | Enum | Yes | Solar Panel / Inverter / Battery / Service |
| `warranty_months` | Number | Yes | 60 |
| `common_complaints` | String | No | "Low output, cracked frame, bird droppings" |
| `service_region` | String | No | Nashik, Pune, Aurangabad |

---

### C. Complaint Categories & SLA Configuration

> Please confirm, modify, or add categories. These are configured directly in the system.

| Category | Sub-Categories | Default SLA (hours) |
|---|---|---|
| Installation Issue | Wiring fault, Panel alignment, Inverter setup | 48 |
| Product Defect | Panel cracked, Inverter failure, Battery issue | 72 |
| Billing / Subsidy | Invoice mismatch, Overcharge, Refund, Subsidy delay | 24 |
| Service Delay | Delayed installation, Missed service visit | 24 |
| Warranty Claim | Under-warranty replacement, Repair | 96 |
| Net Metering Issue | Application pending, Meter not installed, Grid rejection | 48 |
| General Inquiry | Documentation, Technical query | 12 |
| Other | — | 48 |

---

### D. Historical Complaint Data (If Available)

If the company has any existing complaint records (WhatsApp screenshots, email threads, Excel logs), please share in any format. Minimum useful fields:

| Field | Description |
|---|---|
| Date raised | When the issue was reported |
| Customer name + phone | Contact details |
| Product involved | Which product/service |
| Complaint summary | Brief description |
| Resolution status | Resolved / Unresolved |
| Resolution date | When closed |
| Handled by | Which employee |

---

### E. Branding & Configuration

| Asset | Format | Notes |
|---|---|---|
| Company Logo | PNG/SVG (high-res) | Already received ✅ |
| Brand Colors | Hex codes | Confirm primary + secondary |
| Notification Email Address | Email | e.g., `support@natureteksolar.com` |
| SMS Sender ID | Text | If using MSG91 (e.g., NTSOL) |
| Preferred language | — | English / Marathi / Hindi (or all three) |
| Telegram Bot Name | Text | e.g., `NatureTek Support` |
| T&C / Privacy Policy text | Document | For display on complaint portal |

---

## 16. Project Plan & Milestones

### 16.1 Team Distribution (5 Members)

| Member | Role |
|---|---|
| Member 1 | Project Lead + Backend Core (Auth, DB schema, API structure, deployment) |
| Member 2 | Frontend — Customer Portal (complaint form, status tracker, feedback screen) |
| Member 3 | Frontend — Employee & Admin Dashboards (ticket list, detail view, admin panel) |
| Member 4 | Backend — Telegram Bot + Notification System + SLA cron jobs |
| Member 5 | Backend — Analytics/Reporting + File Storage + QA + Documentation |

---

### 16.2 Sprint Plan (12 Weeks)

| Sprint | Weeks | Deliverables |
|---|---|---|
| **Sprint 1** | 1–2 | Requirements sign-off, DB schema, GitHub repo setup, env config, deploy skeleton |
| **Sprint 2** | 3–4 | Auth system (JWT + bcrypt), complaint submission API, basic customer portal |
| **Sprint 3** | 5–6 | Employee dashboard, ticket detail view, status update flow, comment thread |
| **Sprint 4** | 7–8 | Admin dashboard, assignment system, SLA engine (cron), email notifications |
| **Sprint 5** | 9–10 | Telegram Bot (full flow), analytics dashboard, CSV export, feedback system |
| **Sprint 6** | 11–12 | UAT with client, bug fixes, performance testing, final deployment, documentation |

---

### 16.3 Milestones

| Milestone | Target Date | Criteria |
|---|---|---|
| PRD Approved by Client | Week 1 | Signed sign-off from company coordinator |
| Dataset Received from Client | Week 2 | All files from Section 15 delivered |
| Working Prototype | Week 6 | Core ticket creation and tracking functional |
| Feature Complete | Week 10 | All features including Telegram Bot running |
| Client UAT | Week 11 | Company staff tests the system on staging |
| Production Deployment | Week 12 | Live at `grievance.natureteksolar.com` |

---

## 17. Assumptions & Constraints

### Assumptions
- Client will provide all dataset items from Section 15 within Week 2
- Client / site admin can add a single hyperlink button to the BoostKit website
- Client will set up a subdomain `grievance.natureteksolar.com` pointing to the Vercel/Render deployment
- An email address (e.g., `support@natureteksolar.com`) will be available for outgoing notifications
- Client team is available for one weekly review meeting with the project team
- SMS/WhatsApp API costs (Phase 2) will be borne by the client

### Constraints
- Existing website is on a locked SaaS platform; native integration not possible in Phase 1
- Free-tier infrastructure must be used (MongoDB Atlas M0, Vercel, Render free tier)
- Project must be completed within semester deadline (~12 weeks)
- No native mobile app in Phase 1; mobile-responsive web is mandatory
- WhatsApp integration deferred to Phase 2 (requires official Meta Business API)

---

## 18. Future Enhancements — Phase 2

| Feature | Description |
|---|---|
| WhatsApp Business API | Official Meta Cloud API integration for two-way WhatsApp complaints |
| AI Auto-Classification | ML model to auto-assign category and priority from complaint text |
| Native Mobile App | Android/iOS app for customers and field engineers |
| CRM Integration | Link complaints to Zoho CRM customer purchase history |
| Field Engineer GPS Tracking | Real-time location tracking for on-site service visits |
| Multi-language Portal | Marathi and Hindi language support |
| Predictive Analytics | Identify recurring defect patterns before they become widespread |
| SMS OTP | Upgrade from email OTP to SMS OTP via MSG91 |

---

## 19. Approval & Sign-Off

| Role | Name | Signature | Date |
|---|---|---|---|
| Client Representative (Nature Tek Solar) | | | |
| Project Lead (VIT Pune) | | | |
| Faculty Mentor / Project Guide | | | |

---

> **Document prepared by:** VIT Pune — CSE-AI Division E, Batch 3 (Industry Project Team)  
> **Company:** Nature Tek Solar Pvt. Ltd., Nashik  
> **Version:** 2.0 — Includes Telegram Bot as official feature; WhatsApp moved to Phase 2  
> **Last Updated:** May 2026
