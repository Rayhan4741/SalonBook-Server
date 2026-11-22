# Production Deployment Guide

## Render / Railway / Heroku Backend Setup
1. Set Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=<Production MongoDB Connection String>`
   - `BETTER_AUTH_SECRET=<32+ Character Secret Key>`
   - `BETTER_AUTH_URL=https://<your-backend-domain>`
   - `CLIENT_URL=https://<your-frontend-domain>`
   - `SERVER_URL=https://<your-backend-domain>`
   - `STRIPE_SECRET_KEY=sk_live_...` or `sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `IMGBB_API_KEY=...`
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Post-deploy seeding: `npm run seed`
