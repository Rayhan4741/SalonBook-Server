# SalonBook — Backend REST API

Production-ready REST API backend for the **SalonBook — Salon Appointment Booking Platform**. Built with Node.js, Express.js, TypeScript, MongoDB, Better Auth, and Stripe.

---

## 🌟 Architecture & Features

- **TypeScript Express Server**: Fully typed architecture with strict compilation and modular domain structure.
- **Better Auth Integration**: Managed authentication collections (`user`, `session`, `account`, `verification`) integrated with native MongoDB adapter.
- **JWT & Role-Based Security**: Independent server-side verification middleware (`authenticate`, `requireAdmin`, `requireCustomer`, `checkBlockedUser`).
- **Concurrency-Safe Appointment Booking**: MongoDB partial unique indexes preventing race condition double-bookings for active slots.
- **Service Price Snapshots**: Booking stores immutable historical snapshot prices.
- **Stripe Checkout & Webhook Integration**: Raw body signature verification with atomic payment status and transaction ledger.
- **ImgBB Image Upload**: Server-side proxy with Multer file validation (format and 5MB size limits).
- **Administrative Analytics**: Real-time MongoDB aggregations for revenue, booking counts, and user metrics.
- **Protected User Governance**: Administrative block and unblock controls with protections against admin self-modification.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js 4.x (TypeScript)
- **Database & ODM**: MongoDB, Mongoose 8.x, Native MongoDB Client
- **Authentication**: Better Auth with JWT plugin
- **Payments**: Stripe Node SDK
- **Security**: Helmet, CORS, Express Rate Limit, BcryptJS, JSONWebToken
- **Image Uploads**: Multer, Axios (ImgBB API)

---

## 📋 Environment Variables

Create a `.env` file in the `server` root following `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/salonbook
BETTER_AUTH_SECRET=your_32_char_secret_key
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
GOOGLE_CLIENT_ID=optional_google_client_id
GOOGLE_CLIENT_SECRET=optional_google_client_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
IMGBB_API_KEY=your_imgbb_api_key
ADMIN_EMAIL=admin@salonbook.com
ADMIN_PASSWORD=Admin1234!
```

---

## 🚀 Installation & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Seeding
Initializes default salon services and provisions the default administrator account securely:
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `ALL` | `/api/auth/*` | Public / Auth | Better Auth handlers |
| `GET` | `/api/services` | Public | List active services with search, category, sort |
| `GET` | `/api/services/:id` | Public | Get service details by ID |
| `POST` | `/api/services` | Admin | Create new salon service |
| `PATCH` | `/api/services/:id` | Admin | Update service details |
| `DELETE` | `/api/services/:id` | Admin | Safely deactivate/delete service |
| `POST` | `/api/appointments` | Customer | Request appointment (conflict checked) |
| `GET` | `/api/appointments/my` | Customer | View customer's appointment list |
| `GET` | `/api/appointments/:id` | Owner / Admin | View specific appointment details |
| `PATCH` | `/api/appointments/:id/cancel` | Customer | Cancel own pending appointment |
| `GET` | `/api/admin/appointments` | Admin | View all appointments with filters |
| `PATCH` | `/api/admin/appointments/:id/confirm` | Admin | Confirm pending appointment |
| `PATCH` | `/api/admin/appointments/:id/cancel` | Admin | Cancel pending/confirmed appointment |
| `GET` | `/api/admin/users` | Admin | List registered customers |
| `PATCH` | `/api/admin/users/:id/block` | Admin | Block customer account |
| `PATCH` | `/api/admin/users/:id/unblock` | Admin | Unblock customer account |
| `GET` | `/api/customer/dashboard` | Customer | Customer stats and recent bookings |
| `GET` | `/api/admin/dashboard` | Admin | Admin stats and business metrics |
| `POST` | `/api/payments/checkout-session` | Customer | Create Stripe checkout session |
| `GET` | `/api/payments/appointment/:id` | Owner / Admin | Verified appointment payment status |
| `POST` | `/api/payments/webhook` | Stripe | Raw body verified Stripe webhook |
| `GET` | `/api/admin/transactions` | Admin | List verified payment transactions |
| `POST` | `/api/uploads/image` | Authenticated | Upload image to ImgBB |
| `GET` | `/api/profile` | Authenticated | Get current user profile |
| `PATCH` | `/api/profile` | Authenticated | Update allowed profile fields |

---

## 🔗 Repository Reference

- **GitHub Repository**: [SalonBook Official Repository](https://github.com/Rayhan4741/SalonBook)
- **Live Deployment Platform**: [SalonBook Live Backend](https://salonbook-api.onrender.com)


1. **Role Enforcement**: Client-provided roles are rejected. Server models and middleware query trusted database records.
2. **Blocked User Protection**: Blocked users are immediately forbidden from booking, paying, or accessing protected routes.
3. **Idempotent Webhooks**: Handled via raw cryptographic signature verification with duplicate transaction safeguards.
4. **Rate Limiting**: Protects against brute-force attacks on sensitive authentication and booking paths.
5. **No Secret Leaks**: Stack traces and internal identifiers are stripped from production responses.
