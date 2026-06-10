# NatureTek Solar — Customer Grievance Management System

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)

> Industry Project — VIT Pune, CSE-AI Division E, Batch 3  
> Client: Nature Tek Solar Pvt. Ltd., Nashik, Maharashtra

---

## Project Structure

```
cgms-natureteksolar/
│
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/              # Shared: Button, Input, Badge, Modal
│   │   │   ├── customer/            # ComplaintForm, StatusTracker, FeedbackForm
│   │   │   ├── employee/            # TicketList, TicketDetail, CommentThread
│   │   │   └── admin/               # AdminDashboard, Analytics, UserManagement
│   │   ├── pages/
│   │   │   ├── CustomerPortal.jsx   # / route
│   │   │   ├── TrackTicket.jsx      # /track route
│   │   │   ├── Login.jsx            # /login
│   │   │   ├── EmployeeDashboard.jsx# /employee
│   │   │   └── AdminDashboard.jsx   # /admin
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTickets.js
│   │   │   └── useNotifications.js
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   └── statusColors.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   ├── models/
│   │   ├── Complaint.js
│   │   ├── User.js
│   │   ├── TicketHistory.js
│   │   ├── Notification.js
│   │   ├── Category.js
│   │   └── SLAConfig.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── complaint.routes.js
│   │   ├── user.routes.js
│   │   ├── report.routes.js
│   │   └── telegram.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── complaint.controller.js
│   │   ├── user.controller.js
│   │   ├── report.controller.js
│   │   └── telegram.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verify + role check
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── email.service.js         # Nodemailer
│   │   ├── otp.service.js           # Email OTP generation/verify
│   │   ├── telegram.service.js      # node-telegram-bot-api
│   │   ├── sla.service.js           # SLA computation
│   │   └── notification.service.js  # Orchestrates email + Telegram
│   ├── jobs/
│   │   ├── sla.checker.js           # Hourly SLA breach cron
│   │   └── autoClose.job.js         # Daily auto-close resolved tickets
│   ├── utils/
│   │   ├── ticketId.js              # NTS-YYYY-XXXXX generator
│   │   ├── autoClassify.js          # Telegram keyword categorization
│   │   └── emailTemplates.js        # HTML email templates
│   ├── seed/
│   │   ├── seed.js                  # Run once to seed DB
│   │   ├── employees.json
│   │   ├── products.json
│   │   └── categories_sla.json
│   ├── .env.example
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Entry point
│   └── package.json
│
├── docs/
│   ├── Nature_Tek_Solar_Grievance_PRD.md
│   ├── Nature_Tek_Solar_Dataset_Requirements.md
│   └── architecture.png
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## Team & Responsibilities

| Member | Branch | Responsibility |
|---|---|---|
| Member 1 | `feat/backend-core` | Auth, DB models, core API, deployment |
| Member 2 | `feat/customer-portal` | Complaint form, status tracker, feedback screen |
| Member 3 | `feat/dashboards` | Employee dashboard, admin panel, ticket detail |
| Member 4 | `feat/telegram-notifications` | Telegram bot, email service, SLA cron jobs |
| Member 5 | `feat/analytics-qa` | Reports, CSV export, testing, documentation |

### Branch Strategy

```
main                  ← production-ready, deployed to Render/Vercel
└── dev               ← integration branch, all features merged here first
    ├── feat/backend-core
    ├── feat/customer-portal
    ├── feat/dashboards
    ├── feat/telegram-notifications
    └── feat/analytics-qa
```

**Rule:** Never push directly to `main`. All merges go `feat/* → dev → main` via Pull Request with at least 1 reviewer approval.

---

## Environment Variables

### `server/.env.example`

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cgms_nts

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Email (Gmail SMTP)
EMAIL_USER=support@natureteksolar.com
EMAIL_PASS=your_gmail_app_password


# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://api.grievance.natureteksolar.com/v1/telegram/webhook

# OTP
OTP_EXPIRY_MINUTES=10

# Frontend URL (for CORS)
CLIENT_URL=https://grievance.natureteksolar.com
```

### `client/.env.example`

```env
VITE_API_BASE_URL=https://api.grievance.natureteksolar.com/v1
VITE_APP_NAME=NatureTek Solar Support
```

---

## Local Development Setup

### Prerequisites

- Node.js 20 LTS
- MongoDB Atlas account (free M0 tier)
- ImgBB account (free tier) for image uploads
- Telegram Bot token (from @BotFather)
- Gmail account with App Password enabled

### 1. Clone the repo

```bash
git clone https://github.com/your-org/cgms-natureteksolar.git
cd cgms-natureteksolar
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run seed       # Seeds DB with sample employees, products, categories
npm run dev        # Starts server on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/v1
npm run dev        # Starts Vite dev server on http://localhost:5173
```

### 4. Setup Telegram Webhook (Local Dev)

For local testing, use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 5000
# Copy the https URL, e.g., https://abc123.ngrok.io

# Set webhook
curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://abc123.ngrok.io/v1/telegram/webhook"}'
```

---

## Deployment

### Backend → Render

1. Connect GitHub repo to Render
2. Create new **Web Service** → select `server/` as root
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env vars from `.env.example`

### Frontend → Vercel

1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `client/`
3. Framework preset: **Vite**
4. Add `VITE_API_BASE_URL` env var pointing to Render backend URL

### Subdomain DNS Setup

In the domain registrar for `natureteksolar.com`:

```
Type    Name        Value
CNAME   grievance   cname.vercel-dns.com     ← Frontend
CNAME   api         your-app.onrender.com    ← Backend
```

---

## API Quick Reference

| Method | Endpoint | Access |
|---|---|---|
| POST | `/v1/complaints` | Public |
| GET | `/v1/complaints/track/:ticket_id` | Public + OTP |
| GET | `/v1/complaints` | Employee+ |
| PATCH | `/v1/complaints/:id/status` | Employee+ |
| PATCH | `/v1/complaints/:id/assign` | Admin+ |
| POST | `/v1/auth/login` | Public |
| POST | `/v1/auth/otp/send` | Public |
| GET | `/v1/reports/summary` | Admin+ |
| GET | `/v1/reports/export` | Admin+ |
| POST | `/v1/telegram/webhook` | Telegram only |
| POST | `/v1/media/upload` | Base64 Image Proxy (Public) |

Full API docs: see `docs/Nature_Tek_Solar_Grievance_PRD.md` Section 10

---

## Recent Updates

### Security Enhancements
- **Telegram Proxy Validation:** Added strict SSRF and directory traversal checks to block malicious file paths.
- **NoSQL Injection Prevention:** Enforced string casting in `auth.controller.js` to mitigate object-based NoSQL injection risks.
- **Mass Assignment Protection:** Integrated `{ runValidators: true }` across all status and assignment updates.
- **API Key Proxy:** Built a dedicated `/v1/media/upload` proxy route to securely upload images to ImgBB without exposing `VITE_IMGBB_API_KEY` to the public frontend.

### Performance & UX
- **Page Visibility API Polling:** `NotificationBell.jsx` now intelligently pauses auto-polling when the browser tab is hidden, dramatically reducing server bandwidth.
- **Optimized Initial Load:** Re-architected `AdminDashboard.jsx` to load all resources simultaneously via `Promise.all` with a unified loading state.
- **SLA Cron Optimization:** Replaced highly inefficient N+1 queries in `sla.checker.js` with batch `insertMany` and `updateMany` operations.
- **Mongoose Indexes:** Implemented indexing across Complaints, Users, and Notifications for high-speed lookups.

---

## License

MIT — For academic use. Nature Tek Solar Pvt. Ltd. retains rights to the deployed system.
