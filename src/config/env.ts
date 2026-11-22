import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/salonbook",
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || "salonbook-default-better-auth-secret-key-32chars",
  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  serverUrl: process.env.SERVER_URL || "http://localhost:5000",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  imgbbApiKey: process.env.IMGBB_API_KEY || "",
  adminEmail: process.env.ADMIN_EMAIL || "admin@salonbook.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin1234!",
};

export const validateEnv = () => {
  const missing: string[] = [];
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI not set, defaulting to mongodb://127.0.0.1:27017/salonbook");
  }
  if (!process.env.BETTER_AUTH_SECRET) {
    console.warn("⚠️ BETTER_AUTH_SECRET not set, using fallback secret for development");
  }
  return missing;
};
