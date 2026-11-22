# Stripe Webhook Security Verification

- Endpoint: `/api/payments/webhook`
- Body parser: `express.raw({ type: 'application/json' })`
- Verification: `stripe.webhooks.constructEvent(rawBody, signature, secret)`
- Signature tampering returns 400 Bad Request immediately.
- Idempotent upsert prevents double-crediting.
