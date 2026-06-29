# Technical Design Document (TDD)

## Core Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS, React Router v6 (for Public/Protected role-based routes).
*   **Backend:** Node.js, Express.js (Modular Feature-based Architecture under `server/src/modules/`).
*   **Database:** MongoDB Atlas (Mongoose ODM).
*   **Integrations:** Nodemailer (Email notification) and Telegram Bot API (Real-time tracking notifications).

## Backend Architecture

The backend follows a modular, feature-based design pattern. All domain logic is encapsulated within specific feature directories under `server/src/modules/`:
*   `Auth`: Authentication, OTP generation, and JWT validation.
*   `Complaint`: Ticket lifecycle management, history tracking, and status transitions.
*   `Notification`: System alert mechanisms.
*   `Report`: Data aggregation and analytics generation.
*   `Routing`: Dynamic category-to-department assignment definitions.
*   `User`: Employee and customer profile management.

## Key Implementation Mechanisms

### Atomic Sequential ID Generation
To ensure unique and sequential Ticket IDs (e.g., `NTS-0000-0001`), the system utilizes a database-level incremental sequence pattern via a dedicated counter model (`counter.model.js`). This replaces unreliable random or recursive generation loops with a strictly atomic operation (`$inc`).

### Role-Based Access Control (RBAC)
To enforce complete separation between Customers, Staff, and Admins:
*   **Backend:** JWT token middleware strictly validates roles before allowing endpoint execution.
*   **Frontend:** Dynamic React routing pipelines (`PublicRoute` and `ProtectedRoute` components) automatically guard UI views based on the authenticated user's privileges.

### Automated SLA Tracking
A background execution engine (`sla.checker.js`) acts as a continuous watchdog. It routinely scans pending tickets against their SLA deadlines. If a threshold is crossed, the engine automatically shifts the ticket into an escalated breach state and triggers internal alerts.

### API Response Optimization
Server-side pagination layouts are implemented on high-traffic data retrieval endpoints (such as listing complaints and users). This restricts the payload size per request, allowing the system to handle a high data scale efficiently without degrading frontend or backend performance.
