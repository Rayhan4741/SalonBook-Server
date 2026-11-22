# ADR 005: Dual Dashboard Route Aliasing

## Status: Accepted
## Context:
Frontend and REST client backwards compatibility.
## Decision:
Mounted router on both `/api/dashboard` and `/api/customer/dashboard` to guarantee zero 404s.
