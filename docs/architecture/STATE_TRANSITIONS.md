# Appointment State Transition Rules

- **pending** -> **confirmed** (by Admin)
- **pending** -> **cancelled** (by Customer or Admin)
- **confirmed** -> **cancelled** (by Admin only)
- **confirmed** -> **paid** (triggered by verified Stripe Webhook)
