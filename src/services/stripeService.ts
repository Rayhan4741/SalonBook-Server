import { Appointment } from "../models/Appointment";
import { Transaction } from "../models/Transaction";

export class StripeService {
  static async handleSuccessfulSession(session: any) {
    const appointmentId = session.metadata?.appointmentId || session.client_reference_id;
    if (!appointmentId) return null;

    const appt = await Appointment.findById(appointmentId);
    if (!appt) return null;

    appt.paymentStatus = "paid";
    await appt.save();

    return Transaction.create({
      appointmentId: appt._id,
      customerId: appt.customerId,
      amount: session.amount_total ? session.amount_total / 100 : appt.servicePrice,
      currency: session.currency || "usd",
      stripeSessionId: session.id,
      status: "paid",
    });
  }
}
