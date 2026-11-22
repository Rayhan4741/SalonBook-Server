import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelMyAppointment,
} from "../controllers/appointmentController";
import { authenticate, requireCustomer, checkBlockedUser } from "../middleware/authMiddleware";

const router = Router();

// Customer only appointment booking & management
router.post("/", authenticate, checkBlockedUser, requireCustomer, createAppointment);
router.get("/my", authenticate, checkBlockedUser, requireCustomer, getMyAppointments);
router.get("/:id", authenticate, checkBlockedUser, getAppointmentById);
router.patch("/:id/cancel", authenticate, checkBlockedUser, requireCustomer, cancelMyAppointment);

export default router;
