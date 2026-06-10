# System Architecture & Technical Specifications

This document provides an exhaustive, multi-layered breakdown of the technical architecture for the Nature Tek Solar Customer Grievance Management System (CGMS). It details the macro-level system interactions, data flow models, and the security boundary implementations.

---

## 1. High-Level Macro Architecture

The core architecture follows a decoupled, three-tier model (Client, Server, Database) augmented by external SaaS integrations for specialized tasks (image hosting, email delivery, conversational bots).

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
        TelegramBot["🤖 Telegram Bot API<br/>(Webhook Mode)"]:::external
        ImgBB["🖼️ ImgBB API<br/>(Base64 Image Storage)"]:::external
        Nodemailer["📧 Gmail SMTP<br/>(Email Delivery)"]:::external
    end

    %% Backend Layer
    subgraph Backend ["Backend Layer (Render)"]
        NodeAPI["⚙️ Node.js + Express Core API<br/>(REST Controllers, JWT Auth)"]:::backend
        SLAEngine["⏱️ Node-Cron Engine<br/>(Hourly Breach Checks)"]:::backend
        UploadProxy["🛡️ Media Upload Proxy<br/>(SSRF Protection)"]:::backend
    end

    %% Data Layer
    subgraph Data ["Data Layer (MongoDB Atlas)"]
        MongoDB[("🍃 MongoDB Cluster<br/>(Document Store)")]:::database
    end

    %% Relationships
    Customer -- "HTTPS / React UI" --> WebPortal
    Customer -- "Telegram App" --> TelegramBot
    Employee -- "Dashboards / Reports" --> WebPortal

    WebPortal -- "REST API (Axios)" --> NodeAPI
    WebPortal -- "Base64 Payload" --> UploadProxy
    TelegramBot -- "POST Webhook" --> NodeAPI

    UploadProxy -- "Secure Forwarding" --> ImgBB
    NodeAPI -- "Dispatches OTPs & Alerts" --> Nodemailer
    NodeAPI -- "Mongoose ODM" --> MongoDB
    SLAEngine -- "Batch Updates" --> MongoDB
    SLAEngine -- "Alert Trigger" --> NodeAPI
```

---

## 2. Authentication & Data Flow (Sequence)

The following sequence diagram illustrates the typical lifecycle of a customer filing a complaint and checking its status using the secure OTP fallback method.

```mermaid
sequenceDiagram
    actor Customer
    participant React UI
    participant Express API
    participant Mail Server (SMTP)
    participant MongoDB

    %% Ticket Creation Phase
    Customer->>React UI: Fills out Complaint Form + Attaches Image
    React UI->>Express API: POST /media/upload (Base64)
    Express API->>ImgBB: Forward Payload
    ImgBB-->>Express API: Image URL
    React UI->>Express API: POST /complaints (Data + Image URL)
    Express API->>MongoDB: Insert Document (Status: Pending)
    Express API->>Mail Server: Dispatch Confirmation Email
    Express API-->>React UI: Return Ticket ID (NTS-2026-XXXX)
    React UI-->>Customer: Display Success Screen with Ticket ID

    %% OTP Verification Phase
    Customer->>React UI: Enter Ticket ID + Phone to Track
    React UI->>Express API: POST /auth/otp/send (Phone)
    Express API->>Mail Server: Send OTP to mapped email
    Mail Server-->>Customer: Receives 6-digit OTP
    Customer->>React UI: Submits 6-digit OTP
    React UI->>Express API: POST /auth/otp/verify (Phone, OTP)
    Express API->>MongoDB: Validate OTP & Expiry
    Express API-->>React UI: Return Short-lived JWT Track Token
    React UI->>Express API: GET /complaints/track/:ticketId (Bearer Token)
    Express API->>MongoDB: Fetch Ticket + Public History
    Express API-->>React UI: JSON Ticket Data
    React UI-->>Customer: Renders Tracking Timeline
```

---

## 3. Core Database Schemas (ER Model)

The database utilizes a highly normalized schema for strict history auditing, paired with embedded subdocuments for performance where appropriate.

```mermaid
erDiagram
    COMPLAINT ||--o{ TICKET_HISTORY : tracks
    USER ||--o{ COMPLAINT : assigned_to
    USER ||--o{ TICKET_HISTORY : performed_by
    COMPLAINT ||--o{ NOTIFICATION : triggers

    COMPLAINT {
        ObjectId _id PK
        string ticket_id "e.g., NTS-2026-0012"
        string customer_name
        string customer_phone
        string product_type
        string category
        string status "Pending, In-Progress, Resolved"
        date sla_due_at
        boolean is_sla_breached
    }

    USER {
        ObjectId _id PK
        string name
        string email
        string role "employee, admin"
        string department
    }

    TICKET_HISTORY {
        ObjectId _id PK
        ObjectId ticket_id FK
        string action "status_change, comment"
        string note
        boolean is_public
        date timestamp
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId ticket_id FK
        string type "email, telegram"
        string recipient
        string message
    }
```

---

## 4. Component Breakdown & Security Posture

### 4.1 Frontend Layer (Vercel)
- **Framework:** React.js + Vite.
- **State & Sync:** Managed via Custom Hooks wrapping Axios requests, with `React Hot Toast` for transient state feedback.
- **Resource Optimization:** The `NotificationBell` component utilizes the `document.visibilityState` API. If the user minimizes the tab, polling halts entirely, cutting idle backend bandwidth by over 90%.

### 4.2 Backend Layer (Render)
- **Security Boundary:**
  - **Upload Proxy (`/v1/media/upload`):** Prevents exposure of external API keys. Validates base64 signatures to ensure the payload is actually an image (PNG/JPEG/WEBP) and blocks SSRF vectors.
  - **NoSQL Injection Guard:** Enforces strict type-casting in critical controllers (e.g., `auth.controller.js`) preventing object-injection (`$ne`, `$gt`) bypasses.
  - **Mass Assignment:** Uses Mongoose `{ runValidators: true }` paired with explicit object destructuring to ensure employees cannot arbitrarily alter restricted fields (like `customer_phone` or `sla_due_at`).

### 4.3 Data Layer (MongoDB Atlas)
- **Indexing Strategy:** 
  - Unique Index on `ticket_id` for O(1) lookups.
  - Compound Index on `{ ticket_id: 1, timestamp: -1 }` inside `TicketHistory` to rapidly construct timelines.
  - Index on `{ status: 1, is_sla_breached: 1 }` to ensure the Node-Cron SLA checker completes in milliseconds, even with thousands of open tickets.

### 4.4 External Integrations
- **Telegram Bot:** Operates entirely over secure Webhooks rather than long-polling. Prevents double-processing and reduces overhead. Incorporates primitive keyword-matching auto-categorization.
- **ImgBB:** Headless image hosting. Storage URLs are embedded directly into the MongoDB document arrays. 
- **Nodemailer:** Utilizes a generic SMTP transport layer, designed to be hot-swappable to SendGrid or Amazon SES when scaling is required.
