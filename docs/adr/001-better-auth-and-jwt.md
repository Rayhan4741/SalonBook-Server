# ADR 001: Better Auth with Hybrid JWT Session Bridge

## Status: Accepted
## Context:
Better Auth is required for social login and credential handling. Express routes require JWT for stateless authorization.
## Decision:
We bridged Better Auth session lookup with JWT verification middleware in `authMiddleware.ts`.
