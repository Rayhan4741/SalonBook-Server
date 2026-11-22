# Local Stripe Webhook Testing with Stripe CLI

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
stripe trigger checkout.session.completed
```
