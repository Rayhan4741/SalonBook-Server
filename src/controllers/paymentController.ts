import { Request, Response } from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import { config } from "../config/env";
import { Appointment } from "../models/Appointment";
import { Transaction } from "../models/Transaction";
import { Service } from "../models/Service";
import { AuthRequest } from "../middleware/authMiddleware";

export const stripe = new Stripe(config.stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2025-01-27.acacia" as any,
});

// POST /api/payments/checkout-session
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.body;
    const user = req.user!;

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ success: false, message: "Valid appointmentId is required." });
      return;
    }

    const appointment = await Appointment.findById(appointmentId).populate<{ serviceId: any }>("serviceId");
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    // Security check: Appointment ownership
    if (appointment.customerId !== user.id) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You can only pay for your own appointments.",
      });
      return;
    }

    // Security check: Only confirmed appointments can be paid
    if (appointment.status !== "confirmed") {
      res.status(400).json({
        success: false,
        message: `Cannot pay for appointment with status '${appointment.status}'. Only confirmed appointments can be paid.`,
      });
      return;
    }

    // Security check: Cannot pay if already paid
    if (appointment.paymentStatus === "paid") {
      res.status(400).json({
        success: false,
        message: "This appointment has already been paid for. Duplicate payment prevented.",
      });
      return;
    }

    // Price validation: using server-side stored snapshot price
    const amountInCents = Math.round(appointment.servicePrice * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      res.status(400).json({ success: false, message: "Invalid appointment service price." });
      return;
    }

    const serviceName = appointment.serviceId?.serviceName || "Salon Appointment";

    if (!config.stripeSecretKey || config.stripeSecretKey === "sk_test_placeholder") {
      // In development when Stripe key is not yet set in environment, provide clear instruction
      res.status(503).json({
        success: false,
        message: "Stripe Secret Key is not configured on the server. Please set STRIPE_SECRET_KEY in server/.env to enable live Stripe checkout.",
      });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `SalonBook: ${serviceName}`,
              description: `Appointment on ${appointment.appointmentDate} at ${appointment.timeSlot}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: user.email,
      client_reference_id: appointment._id.toString(),
      metadata: {
        appointmentId: appointment._id.toString(),
        customerId: user.id,
        customerEmail: user.email,
        servicePrice: appointment.servicePrice.toString(),
      },
      success_url: `${config.clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointment._id.toString()}`,
      cancel_url: `${config.clientUrl}/payment/cancel?appointment_id=${appointment._id.toString()}`,
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create Stripe Checkout session" });
  }
};

// GET /api/payments/appointment/:id
export const getAppointmentPaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid appointment ID." });
      return;
    }

    const appointment = await Appointment.findById(id).populate("serviceId");
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    // Customer ownership or admin check
    if (user.role !== "admin" && appointment.customerId !== user.id) {
      res.status(403).json({ success: false, message: "Forbidden: Not your appointment." });
      return;
    }

    const transaction = await Transaction.findOne({ appointmentId: appointment._id });

    // Resilient fallback for local development / immediate redirect:
    // If appointment is not marked paid yet, but a Stripe session_id is provided, verify directly with Stripe API
    const sessionId = req.query.session_id as string | undefined;
    if (appointment.paymentStatus !== "paid" && sessionId && config.stripeSecretKey) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const sessionApptId = (session.metadata?.appointmentId || session.client_reference_id)?.toString();

        if (session.payment_status === "paid" && sessionApptId === appointment._id.toString()) {
          appointment.paymentStatus = "paid";
          await appointment.save();

          if (!transaction) {
            const newTx = await Transaction.create({
              appointmentId: appointment._id,
              customerId: appointment.customerId,
              amount: appointment.servicePrice,
              currency: session.currency?.toUpperCase() || "USD",
              stripeSessionId: session.id,
              status: "paid",
            });
            res.json({
              success: true,
              data: {
                appointment,
                paymentStatus: "paid",
                transaction: newTx,
              },
            });
            return;
          }
        }
      } catch (stripeErr: any) {
        console.warn("Direct Stripe session verification note:", stripeErr.message);
      }
    }

    res.json({
      success: true,
      data: {
        appointment,
        paymentStatus: appointment.paymentStatus,
        transaction: transaction || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve payment details" });
  }
};

// POST /api/payments/webhook - Verified Stripe webhook
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"];

  if (!sig || !config.stripeWebhookSecret) {
    console.warn("⚠️ Stripe webhook received without signature or STRIPE_WEBHOOK_SECRET");
    res.status(400).json({ error: "Missing signature or webhook secret configuration." });
    return;
  }

  let event: Stripe.Event;

  try {
    // req.body is the raw Buffer when express.raw middleware is used on this route
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret);
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle checkout.session.completed idempotently
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const appointmentId = session.metadata?.appointmentId || session.client_reference_id;
    const customerId = session.metadata?.customerId;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || "usd";

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      console.error("⚠️ Webhook event missing valid appointmentId metadata");
      res.status(400).json({ received: true, error: "Missing appointment metadata" });
      return;
    }

    try {
      // Check existing transaction for idempotency
      const existingTransaction = await Transaction.findOne({ stripeSessionId: session.id });
      if (existingTransaction) {
        console.log(`ℹ️ Webhook: Transaction for session ${session.id} already processed.`);
        res.status(200).json({ received: true, idempotent: true });
        return;
      }

      // Update appointment atomically
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        console.error(`⚠️ Webhook: Appointment ${appointmentId} not found.`);
        res.status(404).json({ received: true, error: "Appointment not found" });
        return;
      }

      appointment.paymentStatus = "paid";
      await appointment.save();

      // Create transaction record
      await Transaction.create({
        appointmentId: appointment._id,
        customerId: customerId || appointment.customerId,
        amount: amountTotal || appointment.servicePrice,
        currency,
        stripeSessionId: session.id,
        status: "paid",
      });

      console.log(`✅ Webhook verified & processed: Appointment ${appointmentId} marked paid. Transaction saved.`);
      res.status(200).json({ received: true, success: true });
    } catch (dbErr: any) {
      if (dbErr.code === 11000) {
        // Duplicate transaction insertion, safe idempotent response
        console.log("ℹ️ Webhook duplicate transaction ignored idempotently.");
        res.status(200).json({ received: true, idempotent: true });
        return;
      }
      console.error("❌ Database error during webhook transaction processing:", dbErr);
      res.status(500).json({ error: "Failed to persist transaction" });
    }
  } else {
    // Other event types acknowledge receipt
    res.status(200).json({ received: true });
  }
};
