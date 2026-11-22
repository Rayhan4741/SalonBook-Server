import { Router } from "express";
import express from "express";
import {
  createCheckoutSession,
  getAppointmentPaymentStatus,
  getMyTransactions,
  handleStripeWebhook,
} from "../controllers/paymentController";
import {
  authenticate,
  requireCustomer,
  checkBlockedUser,
} from "../middleware/authMiddleware";

const router = Router();

// Stripe Webhook: MUST use raw buffer for signature verification
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Customer initiates Stripe Checkout
router.post(
  "/checkout-session",
  express.json(),
  authenticate,
  checkBlockedUser,
  requireCustomer,
  createCheckoutSession
);

// Customer views their verified Stripe payment history
router.get(
  "/my-transactions",
  express.json(),
  authenticate,
  checkBlockedUser,
  requireCustomer,
  getMyTransactions
);

// Verified payment status
router.get(
  "/appointment/:id",
  express.json(),
  authenticate,
  checkBlockedUser,
  getAppointmentPaymentStatus
);

export default router;
