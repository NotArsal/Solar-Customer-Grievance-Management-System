# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Global Error Boundaries:** Prevented "White Screen of Death" UI crashes by implementing React error catchers across the app shell.
- **Mongoose Indexes:** Implemented indexing across Complaints, Users, and Notifications for high-speed lookups.

### Changed
- **Native Fetch Migration (ADR-001):** Completely stripped the bloated `axios` dependency across the entire frontend and backend. Built a lightweight native `fetch` interceptor wrapper (`api.js`) to drastically reduce bundle sizes.
- **Native SLA Engine:** Removed the heavy `node-cron` dependency. SLA checks and escalations are now executed natively via lightweight `setInterval` processes in Node.js.
- **Structured JSON Logging:** Upgraded backend observability by replacing the default `morgan` text logger with a Structured JSON Logger injecting a `x-request-id`.
- **State Dispatcher Pattern (ADR-002):** Refactored a monolithic `if/else` block inside the Telegram Bot into a cleanly mapped `stepHandlers` object.
- **Page Visibility API Polling:** `NotificationBell.jsx` now intelligently pauses auto-polling when the browser tab is hidden.
- **SLA Engine Optimization:** Replaced highly inefficient N+1 queries in `sla.checker.js` with batch `insertMany` and `updateMany` operations.
- **Code Simplification:** Refactored nested `status` validation logic inside `complaint.controller.js` to use flat array `.includes()` checking.
- **Performance Optimization:** Injected Mongoose's `.lean()` method into the high-frequency `Complaint.findOne` and `TicketHistory.find` queries within the `trackComplaint` controller.

### Fixed
- **Null-Safe Edge Cases:** Handled malicious or malformed LocalStorage states to gracefully bounce out invalid users.
- **Main-Thread Freezes:** Restricted base64 file readers explicitly to `image/*` to protect against UI thread locks.
- **Graceful API Fallbacks:** Implemented a global JSON fallback on unmatched routes so frontend parsers don't break on Express's default HTML 404 pages.
- **React Hooks & Syntax Issues:** Resolved ES-lint errors including `setState` inside `useEffect`, JSX structures inside try/catch blocks, and hoisted function declarations in `TrackTicket.jsx`.

### Security
- **Rate Limiting (ADR-003):** Replaced an inadequate, leaky custom rate-limiter in `auth.controller.js` with `express-rate-limit`. Applied a global fallback limiter (100req/15m) and strict throttle (5req/15m) on authentication points.
- **Zero-Trust Telemetry Credentials:** Completely removed hardcoded fallback secrets for ImgBB, strictly enforcing env variable presence.
- **Telegram Proxy Validation:** Added strict SSRF and directory traversal checks to block malicious file paths.
- **NoSQL Injection Prevention:** Enforced string casting in `auth.controller.js` to mitigate object-based NoSQL injection risks.
- **Mass Assignment Protection:** Integrated `{ runValidators: true }` across all status and assignment updates.
- **API Key Proxy:** Built a dedicated `/v1/media/upload` proxy route to securely upload images to ImgBB without exposing keys to the public frontend.
- **Data Quality:** Prevented negative skips and arbitrary limit flooding in `getEmployees` and `listComplaints` endpoints by aggressively clamping query parameters using `Math.max`.
