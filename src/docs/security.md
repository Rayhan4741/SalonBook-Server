# Server Security Standards & Auditing

- **No Public Admin Creation**: Better Auth registration enforces `role: "customer"`.
- **Blocked Status Checks**: Immediate 403 Forbidden rejection for blocked users on all protected endpoints.
- **Strict Role Verification**: Backend verifies role from trusted MongoDB user record, ignoring client headers.
- **Price Integrity**: Authoritative snapshot price saved directly from database during booking request creation.
- **Raw Webhook Parsing**: Cryptographic webhook signature verification prevents forged payment events.
