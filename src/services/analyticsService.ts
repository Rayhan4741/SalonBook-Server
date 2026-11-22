import { Transaction } from "../models/Transaction";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";

export class AnalyticsService {
  static async calculateTotalRevenue() {
    const res = await Transaction.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    return res[0] || { total: 0, count: 0 };
  }

  static async getBookingMetrics() {
    const [total, pending, confirmed, cancelled] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "cancelled" }),
    ]);
    return { total, pending, confirmed, cancelled };
  }
}
