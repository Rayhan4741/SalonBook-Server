import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    serviceName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Haircut & Styling",
        "Hair Coloring",
        "Hair Treatment",
        "Facial & Skincare",
        "Makeup",
        "Manicure & Pedicure",
        "Spa & Massage",
      ],
    },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: [0, "Price must be positive"] },
    duration: { type: Number, required: true, min: [1, "Duration must be at least 1 minute"] },
    image: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ status: 1, category: 1, price: 1 });
serviceSchema.index({ serviceName: "text", description: "text" });

export const Service = mongoose.model<IService>("Service", serviceSchema);
