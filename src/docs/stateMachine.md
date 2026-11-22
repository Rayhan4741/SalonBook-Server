# SalonBook Appointment Lifecycle & State Machine

```
   [ Customer Submits Booking ]
                 │
                 ▼
          status: pending
       paymentStatus: unpaid
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
[ Admin Confirms ]   [ Customer or Admin Cancels ]
       │                   │
       ▼                   ▼
 status: confirmed   status: cancelled
paymentStatus: unpaid      (Terminal)
       │
       ▼
 [ Customer Pay Now via Stripe ]
       │
       ▼
[ Stripe Webhook: checkout.session.completed ]
       │
       ▼
status: confirmed
paymentStatus: paid
```
