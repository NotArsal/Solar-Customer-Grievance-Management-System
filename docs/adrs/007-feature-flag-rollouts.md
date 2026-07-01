# ADR 007: Feature Flag Rollouts

## Status
Accepted

## Context
Deploying new features directly to 100% of the userbase carries significant risk. If a critical bug is introduced, it impacts everyone simultaneously. We need a mechanism to deploy code to production in a dormant state, test it internally, and then gradually expose it to percentages of our userbase (Canary releases).

## Decision
We will decouple **Deployment** (pushing code to the server) from **Release** (exposing code to the user) using a Feature Flag strategy.

1. **Frontend Hook (`useFeatureFlag`)**: UI components will query a feature flag context before rendering experimental components.
2. **URL Overrides**: We will support query parameter overrides (e.g., `?ff_enableNewDashboard=true`) so QA engineers can test dormant features in production without affecting regular users.
3. **Future Extension**: Currently, flags are hardcoded in the client dictionary. In the future, this will be migrated to a dynamic backend endpoint or a service like LaunchDarkly to allow runtime toggling without a redeploy.

## Consequences
- Code complexity increases slightly as developers must maintain both the "flag on" and "flag off" code paths.
- Feature flags must be strictly managed. Stale flags (flags that are fully rolled out) must be deleted from the codebase promptly to prevent dead-code accumulation.
