import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public: Browse services & Service details
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin only: Service Management
router.post("/", authenticate, requireAdmin, createService);
router.patch("/:id", authenticate, requireAdmin, updateService);
router.delete("/:id", authenticate, requireAdmin, deleteService);

export default router;
