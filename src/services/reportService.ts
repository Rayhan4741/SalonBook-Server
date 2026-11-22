import { Transaction } from "../models/Transaction";

export class ReportService {
  static async generateMonthlySummary() {
    return Transaction.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
          totalSales: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
