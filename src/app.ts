import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";

import { config } from "./config/env";
import { auth } from "./auth/betterAuth";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware";
import { correlationIdMiddleware } from "./middleware/correlationId";
import { timingMiddleware } from "./middleware/timingMiddleware";

import serviceRoutes from "./routes/serviceRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import adminRoutes from "./routes/adminRoutes";
import profileRoutes from "./routes/profileRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import healthRoutes from "./routes/healthRoutes";

export const createApp = (): Application => {
  const app: Application = express();

  // Correlation tracking & latency metrics
  app.use(correlationIdMiddleware);
  app.use(timingMiddleware);

  // Helmet Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    config.clientUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Allow during testing or dynamic preview ports
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie", "stripe-signature"],
    })
  );

  // Request logging
  if (config.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  // Rate Limiting on general and auth API
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
  });
  app.use("/api/", limiter);

  // Stripe webhook route with raw body (MUST be placed before express.json)
  app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

  // JSON and URL-encoded body parser for all other endpoints
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Better Auth Node Handler (Express Compatible)
  app.all("/api/auth/*", toNodeHandler(auth));

  // Health Check Endpoint
  app.use("/api/health", healthRoutes);

  // REST Application Endpoints
  app.use("/api/services", serviceRoutes);
  app.use("/api/appointments", appointmentRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/uploads", uploadRoutes);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
