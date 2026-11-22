# SalonBook — Luxury Salon & Wellness Backend REST API (Server)

An enterprise-grade RESTful API built with Express.js, TypeScript, MongoDB, Better Auth, and Stripe webhooks. Powers the SalonBook appointment booking ecosystem with robust authentication, role authorization, and payment lifecycle verification.

- **Author**: Rayhan Alam Towhid
- **Email**: rayhanalamtowhid@gmail.com
- **Client Repository**: [https://github.com/Rayhan4741/SalonBook-Client](https://github.com/Rayhan4741/SalonBook-Client)
- **Server Repository**: [https://github.com/Rayhan4741/SalonBook-Server](https://github.com/Rayhan4741/SalonBook-Server)
- **Live API Endpoint**: [https://salonbook-server.onrender.com](https://salonbook-server.onrender.com)

---

## 🌟 Important Features

### 1. Robust Architecture & Authentication
- **Better Auth Integration**: Secure session handling, email/password registration, password strength enforcement (minimum 6 characters, uppercase, lowercase), and Google OAuth support.
- **JWT Verification Middleware**: Custom Express middleware validating JSON Web Tokens on all protected endpoints, with automatic database fallback and fresh role extraction.
- **Server-Side Role-Based Authorization (RBAC)**: Strict segregation between `customer` and `admin` permissions. Public sign-up restricted from assigning administrative roles.
- **Blocked User Interceptor**: Instant revocation of access to protected endpoints when a user account is placed in blocked status.

### 2. Treatment & Catalog Management
- **Full CRUD for Services**: Admin capability to create, read, update, and soft-delete treatments.
- **Active Status Enforcement**: Real-time validation preventing customers from booking archived or inactive services.
- **Direct Image Hosting**: Integrates with ImgBB API for file uploads with automatic image URL storage.

### 3. Smart Appointment Lifecycle Engine
- **Predefined Time Slots & Date Validation**: Standardized operational slots with validation preventing bookings on past dates.
- **Collision Protection**: Prevents duplicate active bookings on identical dates and time slots.
- **Role Permissions**: Customers can book services and cancel their own pending appointments. Administrators can confirm pending appointments or cancel sessions.
- **Security Rule**: Administrators are prevented from creating customer appointments for themselves.

### 4. Verified Stripe Payment Lifecycle
- **Stripe Checkout Sessions**: Generates secure checkout sessions strictly for admin-confirmed appointments with `unpaid` status.
- **Cryptographic Webhook Signature Verification**: Consumes raw Stripe webhook events (`checkout.session.completed`) using `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`.
- **Idempotent Transaction Ledger**: Atomic creation of transaction records in the `transactions` collection and updating appointment payment status to `paid`. Admin cannot manually mark transactions as paid.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Better Auth + Custom JWT Middleware
- **Payments**: Stripe API & Webhooks
- **Image Hosting**: ImgBB
- **Testing**: Built-in Unit Test Suite (ts-node-dev)

---

## 📋 Required Environment Variables

Create a `.env` file in the root of the `server` directory. **Only variable names are shown below; never commit actual secrets:**

```env
# Server Port and Environment
PORT=5000
NODE_ENV=development

# MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/salonbook

# Better Auth Secret and URL
BETTER_AUTH_SECRET=your_32_character_secret_key_here
BETTER_AUTH_URL=http://localhost:5000

# Application URLs (for CORS and redirects)
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000

# Google OAuth Credentials (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# ImgBB Image Hosting API Key
IMGBB_API_KEY=your_imgbb_api_key

# Default Administrator Account (Seed on Startup)
ADMIN_EMAIL=admin@salonbook.com
ADMIN_PASSWORD=Admin1234!
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- MongoDB instance (local or MongoDB Atlas)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Rayhan4741/SalonBook-Server.git
cd SalonBook-Server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your MongoDB URI, Better Auth secret, and Stripe test credentials.

### Step 4: Run Development Server
```bash
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000) and automatically seed the initial admin account if not already present.

### Step 5: Run Unit Tests
```bash
npm test
```

### Step 6: Production Build
```bash
npm run build
npm start
```

---

## 🔐 Default Administrative Credentials (For Evaluation)

- **Admin Email**: `admin@salonbook.com`
- **Admin Password**: `Admin1234!`
