# Role-Based Access Control Matrix

| Endpoint | Role Required | Blocked Permitted |
|---|---|---|
| GET /api/services | Public | Yes |
| POST /api/appointments | Customer | No |
| GET /api/appointments/my | Customer | No |
| PATCH /api/appointments/:id/cancel | Customer | No |
| GET /api/admin/* | Admin | No |
| POST /api/services | Admin | No |
