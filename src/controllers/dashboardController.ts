import { Response } from "express";
import { Appointment } from "../models/Appointment";
import { Service } from "../models/Service";
import { User } from "../models/User";
import { Transaction } from "../models/Transaction";
import { AuthRequest } from "../middleware/authMiddleware";

// GET /api/customer/dashboard
export const getCustomerDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    const [totalAppointments, pendingCount, confirmedCount, cancelledCount, recentAppointments] =
      await Promise.all([
        Appointment.countDocuments({ customerId: user.id }),
        Appointment.countDocuments({ customerId: user.id, status: "pending" }),
        Appointment.countDocuments({ customerId: user.id, status: "confirmed" }),
        Appointment.countDocuments({ customerId: user.id, status: "cancelled" }),
        Appointment.find({ customerId: user.id })
          .populate("serviceId")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalAppointments,
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount,
        },
        recentAppointments,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to load customer dashboard" });
  }
};

// GET /api/admin/dashboard
export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalCustomers,
      totalActiveServices,
      totalAppointments,
      pendingCount,
      confirmedCount,
      cancelledCount,
      successfulTransactions,
      recentAppointments,
      recentTransactions,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Service.countDocuments({ status: "active" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Transaction.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Appointment.find().populate("serviceId").sort({ createdAt: -1 }).limit(6),
      Transaction.find({ status: "paid" }).populate("appointmentId").sort({ createdAt: -1 }).limit(6),
    ]);

    const paymentStats = successfulTransactions[0] || { totalAmount: 0, count: 0 };

    res.json({
      success: true,
      data: {
        stats: {
          totalCustomers,
          totalActiveServices,
          totalAppointments,
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount,
          totalRevenue: paymentStats.totalAmount,
          successfulPaymentsCount: paymentStats.count,
        },
        recentAppointments,
        recentTransactions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to load admin dashboard" });
  }
};

// GET /api/admin/transactions
export const getAdminTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find()
        .populate({
          path: "appointmentId",
          populate: { path: "serviceId" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve transactions" });
  }
};
