import mongoose from "mongoose";

export function validateCheckoutInput(data: any): string | null {
  if (!data.appointmentId || !mongoose.Types.ObjectId.isValid(data.appointmentId)) {
    return "Valid appointmentId is required to initiate Stripe checkout.";
  }
  return null;
}
