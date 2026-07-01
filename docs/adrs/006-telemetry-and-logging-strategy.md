# ADR 006: Telemetry and Logging Strategy

## Status
Accepted

## Context
As the Customer Grievance Management System (CGMS) moves toward production, we need deep visibility into its operational health. Previously, we relied entirely on `console.log` statements. This approach is problematic because:
- Plain text logs are difficult for log aggregators (like Datadog, ElasticSearch, CloudWatch) to parse.
- There is no easy way to filter by log severity (Info vs. Error).
- Client-side (React) render errors fail silently or display a blank white screen, giving us no visibility into UI crashes.

## Decision
We will adopt a structured, full-stack telemetry strategy:

1. **Backend:** We will use **Winston** as our logging library. All backend logs will be emitted as Structured JSON. This ensures seamless parsing by log aggregators and allows us to attach request IDs (`req.id`) to every log line for distributed tracing.
2. **Frontend:** We will implement a top-level React `<ErrorBoundary />` that catches uncaught exceptions in the render tree.
3. **Telemetry Beacon:** The frontend will utilize the `navigator.sendBeacon()` API to transmit these caught errors back to the server or a dedicated telemetry endpoint without blocking the main thread.

## Consequences
- Developers must use `logger.info()` and `logger.error()` instead of `console.log()` in the backend.
- We will consume more disk space for logs locally, requiring the `winston-daily-rotate-file` transport to prevent disk overflow.
- UI bugs will now be quantifiable, allowing us to prioritize bug fixes based on exact error occurrence rates.
