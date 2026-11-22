# ADR 002: Stripe Webhook Raw Request Buffer

## Status: Accepted
## Context:
Stripe webhook signature validation requires the untampered byte stream.
## Decision:
Mounted `express.raw({ type: 'application/json' })` on `/api/payments/webhook` prior to global parsers.
