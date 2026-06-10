# NatureTek Solar - Frontend (React + Vite)

This is the frontend client for the **Customer Grievance Management System (CGMS)** built for NatureTek Solar Pvt. Ltd.

## Overview
The frontend is a Single Page Application (SPA) built with **React 18** and **Vite**. It uses **Tailwind CSS** for responsive, mobile-first styling and communicates securely with our Node.js backend. 

### Key Features
- **Customer Portal:** A public-facing form where customers can securely file complaints without needing to register. Includes file attachment support (proxied securely through the backend).
- **Status Tracking:** OTP-based tracking timeline allowing customers to view the full resolution history of their tickets.
- **Employee Dashboard:** A dedicated space for employees to view assigned tickets, update statuses, add comments, and request ticket reassignments.
- **Admin Dashboard:** A high-level overview featuring actionable analytics, SLA breach alerts, routing configuration, and full ticket management.
- **Optimized Polling:** Background tasks like notification polling utilize the Page Visibility API to preserve battery and reduce server load when the tab is hidden.

## Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State/Requests:** Axios (with centralized interceptors)
- **Notifications:** React Hot Toast

## Local Development

### Prerequisites
Make sure you have Node.js 20+ installed. Ensure the backend server is running locally on port 5000 before starting the frontend.

### Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and set your API base URL:
```env
VITE_API_BASE_URL=http://localhost:5000/v1
VITE_APP_NAME=NatureTek Solar Support
```

3. Start the Vite dev server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deployment
This project is configured to be deployed easily to **Vercel** or **Netlify**. Ensure the build command is set to `npm run build` and the publish directory is `dist`. Add your `.env` variables to the deployment platform.
