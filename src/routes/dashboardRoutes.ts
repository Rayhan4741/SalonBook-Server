import { Router } from "express";
import {
  getCustomerDashboard,
  getAdminDashboard,
} from "../controllers/dashboardController";
import {
  authenticate,
  requireAdmin,
  requireCustomer,
  checkBlockedUser,
} from "../middleware/authMiddleware";

const router = Router();

// Customer Dashboard
router.get(
  "/customer",
  authenticate,
  checkBlockedUser,
  requireCustomer,
  getCustomerDashboard
);

// Admin Dashboard
router.get(
  "/admin",
  authenticate,
  checkBlockedUser,
  requireAdmin,
  getAdminDashboard
);

export default router;
