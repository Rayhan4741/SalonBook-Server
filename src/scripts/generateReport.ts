import mongoose from "mongoose";
import { config } from "../config/env";
import { Transaction } from "../models/Transaction";

export async function generateRevenueReport() {
  try {
    await mongoose.connect(config.mongodbUri);
    const summary = await Transaction.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    console.log("Revenue Report:", summary[0] || { total: 0, count: 0 });
    await mongoose.disconnect();
  } catch (err) {
    console.error("Report generation failed:", err);
  }
}

if (require.main === module) {
  generateRevenueReport();
}
