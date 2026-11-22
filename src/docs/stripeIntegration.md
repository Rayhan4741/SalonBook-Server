# Stripe Testing & Webhook Guide

## 1. Local Testing with Stripe CLI
```bash
# Listen for Stripe events forwarded to local server
stripe listen --forward-to localhost:5000/api/payments/webhook
```
Copy the webhook secret (`whsec_...`) printed in the CLI and set it in `server/.env` as `STRIPE_WEBHOOK_SECRET`.

## 2. Test Cards (Stripe Test Mode)
Use `4242 4242 4242 4242` with any future date and 3 digits CVC.
