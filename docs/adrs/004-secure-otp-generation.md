# ADR-004: Implement Cryptographically Secure OTP Generation

## Status
Accepted

## Date
2026-06-29

## Context
During a comprehensive security audit of the authentication module, it was discovered that the OTP generation logic relied on a static fallback string (`123456`). While this may have been sufficient for early prototyping or testing, deploying this to a production environment would represent a critical vulnerability (Broken Authentication), as any malicious actor could bypass the OTP verification step using this known constant.

## Decision
We decided to completely remove the hardcoded static OTP and replace it with a cryptographically secure random number generator using Node.js's native `crypto.randomInt` module.

```javascript
// Implementation snippet
const otp = crypto.randomInt(100000, 999999).toString();
```

## Consequences
- **Positive:** Customer accounts are now protected against unauthorized access and brute-force guessing attacks related to static codes.
- **Negative / Operational:** Developers can no longer rely on `123456` to bypass login on their local environments without inspecting the secure server logs where the generated OTP is printed.
- **Future Work:** This OTP must be connected to an actual outbound notification gateway (e.g., Twilio, AWS SNS, or Telegram) before public launch to ensure customers actually receive their codes.
