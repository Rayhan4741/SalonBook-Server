import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  serviceId: mongoose.Types.ObjectId;
  customerId: string; // Better Auth user ID or Mongo ObjectId string
  customerName?: string;
  customerEmail?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  message?: string;
  servicePrice: number; // Snapshot of price at time of booking
  paymentStatus: "unpaid" | "paid";
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    customerId: { type: String, required: true },
    customerName: { type: String },
    customerEmail: { type: String },
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    message: { type: String, default: "" },
    servicePrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active (pending or confirmed) appointments for the same date and time slot
appointmentSchema.index(
  { appointmentDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
  }
);

appointmentSchema.index({ customerId: 1, createdAt: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

export const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);
