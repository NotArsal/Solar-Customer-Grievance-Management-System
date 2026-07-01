# Deprecation Policy

As the NatureTek Solar Customer Grievance Management System (CGMS) evolves, we occasionally need to sunset older features, API endpoints, or database structures to maintain code quality, security, and performance.

This document outlines our standard procedure for safely deprecating and removing code.

## Definition of Terms

*   **Deprecated**: The feature/endpoint is scheduled for removal. It still works, but it is no longer recommended for use.
*   **Sunset**: The date after which the deprecated feature/endpoint will be completely disabled or removed from the codebase.
*   **Migration Path**: A clear set of instructions for migrating from the deprecated functionality to the new alternative.

## Deprecation Process

When a feature or endpoint is identified for deprecation, we adhere to the following steps:

1.  **Announcement & Documentation**:
    *   A formal Architecture Decision Record (ADR) will be written detailing the reasoning for deprecation.
    *   The `CHANGELOG.md` will explicitly list the deprecation.
    *   A Migration Path will be documented.

2.  **Code-Level Warning (Backend API)**:
    *   Any deprecated API endpoint must return a custom HTTP header: `X-API-Deprecation-Date` and optionally `X-API-Sunset-Date`.
    *   The backend logger will emit a specific telemetry event (`api_deprecated_usage`) whenever a deprecated endpoint is hit. This allows us to quantify exactly how many clients are still relying on old behavior.

3.  **Code-Level Warning (Frontend)**:
    *   Deprecated React components will use `console.warn()` in development mode.
    *   A feature flag will be used to toggle the old UI vs. new UI.

4.  **Grace Period**:
    *   We guarantee a minimum grace period of **30 days** between the announcement of a deprecation and the actual sunset date.
    *   For major API changes affecting external integrations (e.g., Telegram bots, third-party ERP systems), a **90-day** grace period will be provided.

5.  **Data Migration**:
    *   If the deprecation involves migrating database schemas, we will provide an automated Mongoose migration script.
    *   Old data structures will not be dropped from MongoDB until telemetry confirms 0% usage of the old schema paths in production.

6.  **Removal (Sunset)**:
    *   Once the sunset date is reached, and telemetry confirms negligible usage, the code will be physically deleted from the `main` branch.
    *   A final "Sunset" announcement will be added to the CHANGELOG.
