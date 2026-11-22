# ADR 003: Double Booking Prevention via Partial Indexes

## Status: Accepted
## Context:
Cancelled appointments should not block rebooking of the same slot.
## Decision:
Created partial filter index on `{ serviceId: 1, appointmentDate: 1, timeSlot: 1 }` where status != 'cancelled'.
