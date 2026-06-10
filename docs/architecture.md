# System Architecture

This document provides a detailed breakdown of the technical architecture for the Nature Tek Solar Customer Grievance Management System (CGMS).

## High-Level Architecture Diagram

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
        ImgBB["🖼️ ImgBB<br/>(Image Storage API)"]:::external
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

## Component Breakdown

### 1. Frontend Layer (Client)
- **Framework:** React.js powered by Vite for rapid compilation.
- **Styling:** Tailwind CSS, utilizing a specific design system centered around an Emerald primary color (`#3ecf8e`).
- **Hosting:** Hosted on Vercel (`grievance.natureteksolar.com`).
- **Core Views:**
  - **Public:** Customer Portal (complaint registration) and OTP-based Ticket Tracker.
  - **Internal:** Employee Dashboard (assigned tickets) and Admin Dashboard (routing, SLA config, analytics).
- **Optimization:** Utilizes the Page Visibility API to pause long-polling API calls (like notification checks) when the browser tab is hidden to save server bandwidth.

### 2. Backend Layer (Server)
- **Framework:** Node.js with Express.
- **Security:** 
  - JWT Authentication for secure role-based access.
  - Strict input sanitization against NoSQL injection.
  - Image Upload Proxy (`/v1/media/upload`) that hides the ImgBB API key from the frontend and accepts base64 payloads securely.
  - Path Traversal prevention on Telegram webhooks.
- **SLA Engine:** A background `node-cron` job running continuously to flag tickets that have breached their designated Service Level Agreement deadlines.

### 3. Data Layer (Database)
- **Database Engine:** MongoDB hosted on MongoDB Atlas.
- **Schemas:** 
  - `User` (Staff authentication and workload tracking).
  - `Complaint` (The master ticket model carrying customer data, status, and SLA).
  - `TicketHistory` (An immutable audit trail of all actions and comments applied to a ticket).
  - `Notification` (Stores all alerts dispatched to users).
- **Optimization:** Compound indexes applied to `TicketHistory` and `Notification` to ensure sub-millisecond retrieval speeds for the dashboards.

### 4. External Services & Integrations
- **Telegram Bot:** A dedicated automated channel allowing users to register and track complaints via their phones seamlessly.
- **ImgBB:** A cloud image storage proxy used to host customer evidence (cracked panels, error codes on inverters).
- **SMTP Notification Pipeline:** Integrated Nodemailer for dispatching OTP verification emails and automated status updates to customers.
