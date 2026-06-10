# NatureTek Solar — Customer Grievance Management System

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)

> Industry Project — VIT Pune, CSE-AI Division E, Batch 3  
> Client: Nature Tek Solar Pvt. Ltd., Nashik, Maharashtra

A comprehensive, role-based Customer Grievance Management System (CGMS) designed specifically for Nature Tek Solar. It digitizes and streamlines the handling of customer issues related to solar panels, inverters, and installations, replacing manual, unorganized WhatsApp messages with a unified tracking platform.

---

## Key Features

- **Public Customer Portal:** Frictionless ticket creation without user registration.
- **OTP-Based Status Tracking:** Secure timeline view for customers to check ticket progress using their registered phone number.
- **Employee & Admin Dashboards:** Dedicated workspaces for managing assignments, updating statuses, and adding internal/public notes.
- **SLA Management Engine:** Hourly background cron jobs that calculate SLA deadlines and automatically flag breached tickets.
- **Advanced Analytics:** Admin insights featuring KPIs, category breakdowns, and SLA compliance metrics.
- **Multi-Channel Integration:** Customers can raise and track complaints via the web portal or directly through an official **Telegram Bot** (`@NatureTekSupportBot`).
- **Automated Notifications:** Real-time email and Telegram alerts dispatched at every critical status transition.

---

## System Architecture

For an in-depth breakdown of the technical components, please refer to our **[Detailed Architecture Documentation](docs/architecture.md)**.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3ecf8e,stroke:#24b47e,stroke-width:2px,color:#171717;
    classDef backend fill:#1c1c1c,stroke:#3ecf8e,stroke-width:2px,color:#ffffff;
    classDef database fill:#4ade80,stroke:#24b47e,stroke-width:2px,color:#171717;
    classDef external fill:#f3f4f6,stroke:#d1d5db,stroke-width:2px,color:#171717;
    classDef user fill:#ffffff,stroke:#3ecf8e,stroke-width:2px,color:#171717,stroke-dasharray: 5 5;

    %% Actors
    Customer(["🧑‍💼 Customer"]):::user
    Employee(["👷 Employee / Admin"]):::user

    %% Frontend Layer
    subgraph Frontend ["Frontend Layer (Vercel)"]
        WebPortal["💻 React Web Portal<br/>(Vite + Tailwind)"]:::frontend
    end

    %% External Interfaces
    subgraph External ["External Services"]
        TelegramBot["🤖 Telegram Bot<br/>(@NatureTekSupportBot)"]:::external
        ImgBB["🖼️ ImgBB<br/>(Image Storage)"]:::external
        Nodemailer["📧 Gmail SMTP<br/>(Email Notifications)"]:::external
    end

    %% Backend Layer
    subgraph Backend ["Backend Layer (Render)"]
        NodeAPI["⚙️ Node.js + Express API<br/>(REST, JWT, Upload Proxy)"]:::backend
        SLAEngine["⏱️ SLA Cron Job<br/>(Hourly Breach Checks)"]:::backend
    end

    %% Data Layer
    subgraph Data ["Data Layer (MongoDB Atlas)"]
        MongoDB[("🍃 MongoDB<br/>(Complaints, Users, History)")]:::database
    end

    %% Relationships
    Customer -- "Raises Complaint / Tracks Status" --> WebPortal
    Customer -- "Raises Complaint via Chat" --> TelegramBot
    Employee -- "Manages Tickets / Views Analytics" --> WebPortal

    WebPortal -- "HTTPS REST API" --> NodeAPI
    TelegramBot -- "Webhook" --> NodeAPI

    NodeAPI -- "Proxies Images" --> ImgBB
    NodeAPI -- "Sends Alerts" --> Nodemailer
    NodeAPI -- "Reads / Writes" --> MongoDB

    SLAEngine -- "Checks Deadlines" --> MongoDB
    SLAEngine -- "Triggers Breach Alerts" --> NodeAPI
```

---

## Project Structure

```
cgms-natureteksolar/
│
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── components/              # Reusable UI elements (common, customer, admin)
│   │   ├── pages/                   # Route views (Portal, Dashboards)
│   │   ├── hooks/                   # Custom React hooks (Auth, Tickets)
│   │   ├── services/                # Axios API service instances
│   │   └── App.jsx
│   └── package.json
│
├── server/                          # Node.js + Express backend
│   ├── config/                      # MongoDB connection setup
│   ├── models/                      # Mongoose Schemas (Complaint, User, SLAConfig)
│   ├── routes/                      # Express routers
│   ├── controllers/                 # Route logic and handlers
│   ├── middleware/                  # JWT auth, error handling
│   ├── services/                    # Nodemailer, Telegram API, SLA logic
│   ├── jobs/                        # node-cron scheduled tasks
│   └── server.js
│
├── docs/                            # Project specifications and diagrams
│   ├── architecture.md              # Detailed architecture breakdown
│   ├── Nature_Tek_Solar_Grievance_PRD.md
│   └── Nature_Tek_Solar_Dataset_Requirements.md
│
└── README.md
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, React Hot Toast |
| **Backend** | Node.js 20 LTS, Express.js, JWT Authentication |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **External APIs** | node-telegram-bot-api, Nodemailer (Gmail SMTP), ImgBB API |
| **Infrastructure** | Vercel (Frontend), Render (Backend) |

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
git clone https://github.com/NotArsal/Solar-Customer-Grievance-Management-System.git
cd Solar-Customer-Grievance-Management-System
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
