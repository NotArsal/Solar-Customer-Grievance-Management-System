# ADR 001: Migration to Native Fetch API

## Status
Accepted

## Context
Our frontend architecture heavily relied on `axios` for HTTP requests to the backend API. While Axios is a popular library, modern browsers (and Node.js environments) now support the native `fetch` API out of the box. 

Maintaining `axios` introduced unnecessary dependency weight, potential security audit surface area, and bundle size overhead. Our backend also previously relied on Axios for several outbound integrations, which increased the Node_modules footprint.

## Decision
We decided to completely remove `axios` from the project (both frontend and backend) and migrate all API calls to the native `fetch` API. A new unified configuration file (`client/src/config/api.js`) was created to wrap `fetch` requests with a standard error handling and authorization header injection interceptor-like pattern.

## Consequences
- **Positive:** Reduced `package.json` bloat, eliminated a potential vector for vulnerability audits, and slightly decreased the frontend build size.
- **Negative:** We had to manually write a small wrapper to handle JSON parsing and `localStorage` token injection, which Axios previously handled via interceptors. Error handling required updating from `err.response.data.message` to awaiting `res.json()`.

## Future Notes
If file upload progress tracking becomes a strict requirement on the frontend, we may need to implement `XMLHttpRequest` directly, as native `fetch` does not natively support outbound progress events as cleanly as Axios did.
