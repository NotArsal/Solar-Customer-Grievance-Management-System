# ADR 002: Telegram Session State Dispatcher

## Status
Accepted

## Context
The Telegram Bot (`server/src/services/telegram.service.js`) was originally structured using a massive monolithic `if/else if` block (over 100 lines long) to handle multi-step user conversations (e.g., NAME -> PHONE -> EMAIL -> PRODUCT -> CATEGORY).

As the conversational flow grew, this file became incredibly difficult to read, maintain, and extend. Any new step required injecting another nested condition, which violated the Open-Closed Principle and increased cognitive load. Additionally, abandoned sessions were never cleared from the `Map()`, resulting in a gradual memory leak over time.

## Decision
1. **State Dispatcher Pattern:** We refactored the massive conditional block into a typed `stepHandlers` object. Each conversational step is now a distinct asynchronous function keyed by the step name. The primary message handler simply looks up the current step in the dictionary and executes the corresponding function.
2. **TTL Session Cleanup:** We introduced a 15-minute Time-To-Live (TTL) for conversational sessions. A `setInterval` loop now checks for `lastActivity` timestamps and automatically prunes sessions that have been idle for too long, sending a final notification to the user.

## Consequences
- **Positive:** The code is significantly more readable and maintainable. Adding a new step to the bot simply requires adding a new key to the `stepHandlers` object. The memory leak has been completely eliminated.
- **Negative:** Session state is still stored in memory. This means if the Node.js process is restarted, all active user complaint sessions will be lost. If the application is scaled horizontally (multiple containers), in-memory mapping will break. 

## Future Notes
If horizontal scaling is required (e.g., running multiple instances of the backend on Render), the in-memory `sessions` Map must be migrated to a distributed key-value store, such as Redis.
