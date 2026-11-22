import { Transaction } from "../models/Transaction";

export class PaymentService {
  static async recordVerifiedTransaction(data: {
    appointmentId: any;
    customerId: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
  }) {
    return Transaction.create({
      appointmentId: data.appointmentId,
      customerId: data.customerId,
      amount: data.amount,
      currency: data.currency,
      stripeSessionId: data.stripeSessionId,
      status: "paid",
    });
  }

  static async findBySessionId(stripeSessionId: string) {
    return Transaction.findOne({ stripeSessionId });
  }
}
