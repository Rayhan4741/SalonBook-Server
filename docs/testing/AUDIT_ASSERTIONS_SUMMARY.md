# Comprehensive Audit Assertions (34/34 Passed)

- [x] Database collections exist with partial unique index
- [x] Unauthenticated booking rejected with 401
- [x] Double booking on same slot rejected with 409 Conflict
- [x] Customer cross-access rejected with 403 Forbidden
- [x] Unconfirmed appointment checkout rejected with 400
- [x] Stripe webhook fake signature rejected with 400
- [x] Customer block/unblock restricts booking privileges
- [x] Safe service soft-deactivation preserves historical bookings
