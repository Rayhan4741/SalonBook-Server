# API Error Handling Standards

All errors conform to a consistent JSON response:
```json
{
  "success": false,
  "message": "Human readable explanation"
}
```
HTTP Status codes used:
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict (e.g. duplicate time slots)
- 500 Internal Server Error
