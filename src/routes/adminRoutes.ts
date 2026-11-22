import { Router } from "express";
import {
  getAdminAppointments,
  confirmAppointment,
  cancelAdminAppointment,
} from "../controllers/appointmentController";
import {
  getUsers,
  getUserById,
  blockUser,
  unblockUser,
} from "../controllers/userController";
import { getAdminTransactions } from "../controllers/dashboardController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Apply admin authentication to all admin routes
router.use(authenticate, requireAdmin);

// Appointments
router.get("/appointments", getAdminAppointments);
router.patch("/appointments/:id/confirm", confirmAppointment);
router.patch("/appointments/:id/cancel", cancelAdminAppointment);

// Users Management
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);

// Transactions
router.get("/transactions", getAdminTransactions);

export default router;
