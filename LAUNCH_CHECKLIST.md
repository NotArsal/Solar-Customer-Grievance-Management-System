# CGMS Pre-Launch Checklist

Before deploying the Customer Grievance Management System (CGMS) to production, verify the following configurations and services to ensure a secure, stable, and observable launch.

## 1. Infrastructure & Environment
- [ ] **MongoDB Atlas:** 
  - Ensure the IP Access List is restricted to the backend hosting provider's IP addresses (e.g., Render, Heroku) instead of `0.0.0.0/0`.
  - Verify the Database User has the least privileges necessary (Read/Write to the CGMS database only, no administrative access).
- [ ] **Environment Variables:**
  - `MONGO_URI`: Must point to the production cluster, not a local or staging database.
  - `JWT_SECRET`: Must be a long, cryptographically secure random string (minimum 64 characters).
  - `NODE_ENV`: Must be explicitly set to `production`.
  - `CLIENT_URL`: Must match the exact production domain of the frontend (e.g., `https://my-cgms.vercel.app`) to prevent CORS errors.
  - `IMGBB_API_KEY`: Must be valid and tested.
  - `TELEGRAM_BOT_TOKEN`: Must be linked to the live production bot.

## 2. Security & Boundaries
- [ ] **OTP Gateway:** The hardcoded OTP fallback has been removed (ADR-004). You **must** wire the `otp` variable in `auth.controller.js` to an SMS API (like Twilio) or Telegram to allow customers to log in.
- [ ] **HTTPS / SSL:** Ensure the hosting provider enforces HTTPS on all routes. The authentication JWT is passed back to the client; intercepting it over HTTP is a critical risk.
- [ ] **Rate Limits:** `express-rate-limit` is active. Verify that your hosting provider correctly forwards client IPs (e.g., if using a load balancer, you may need `app.set('trust proxy', 1)` in `app.js`).

## 3. Observability & Performance
- [ ] **Health Checks:** Verify the `/health` endpoint is exposed and accessible by your uptime monitor (e.g., UptimeRobot, Datadog). It now exposes process memory and uptime.
- [ ] **Structured Logging:** The application logs structured JSON telemetry to `stdout`. Ensure your hosting provider (or a sidecar like Promtail/FluentBit) is configured to aggregate and parse these JSON logs.

## 4. Operational Maintenance
- [ ] **SLA Engine:** The SLA checker runs natively via `setInterval` inside `server.js`. Ensure you are running **exactly one** instance of this worker, or modify the architecture to use a distributed queue (like BullMQ/Redis) if you plan to scale the backend horizontally across multiple dynos/containers.

## 5. Frontend (Client)
- [ ] **API URL:** Ensure `VITE_API_URL` in the frontend build pipeline points to the live production backend URL.
- [ ] **Cache Busting:** Ensure your CDN (Vercel/Netlify) is correctly cache-busting `index.html` while aggressively caching hashed assets (`.js`, `.css`).
