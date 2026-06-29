# ADR-003: Adopt express-rate-limit for API Protection

## Status
Accepted

## Date
2026-06-29

## Context
The system previously relied on a custom, in-memory Map to throttle authentication requests. This manual implementation lacked an automated garbage collection (cleanup) mechanism, which resulted in a slow memory leak as the cache size grew unboundedly over time. Additionally, this manual implementation was only applied to a few specific endpoints, leaving the broader API vulnerable to Distributed Denial of Service (DDoS) attacks.

Key requirements for an upgraded solution:
- Must automatically clean up expired request records.
- Must be easy to apply globally across all API routes.
- Must support granular thresholds (e.g., stricter limits for authentication endpoints).
- Must return standard HTTP 429 Too Many Requests responses.

## Decision
We decided to adopt the `express-rate-limit` package for all rate limiting across the Express API. 

## Alternatives Considered

### Redis-based Rate Limiting (e.g., using `rate-limit-redis`)
- **Pros:** Scalable across multiple Node.js instances/processes.
- **Cons:** Requires provisioning and managing a Redis cluster, adding infrastructure overhead and complexity.
- **Rejected:** The current infrastructure (Render web services) is running on a single instance for simplicity. Adding Redis at this stage is over-engineering. `express-rate-limit` can be upgraded with a Redis store adapter in the future if we scale horizontally.

### Custom In-Memory SetInterval Cleanup
- **Pros:** Zero dependencies.
- **Cons:** We would need to write and maintain complex timer logic to sweep the map regularly, dealing with edge cases around clock drift and memory fragmentation.
- **Rejected:** Native library support is more robust and battle-tested.

## Consequences
- The API is now globally protected with a baseline rate limit (100 requests / 15 minutes) to prevent accidental API abuse.
- Authentication endpoints (`/login`, `/otp`) have a strict limit (5 requests / 15 minutes) to deter brute-force credential stuffing.
- Memory leak resolved.
- Minimal dependency weight added to the backend bundle.
