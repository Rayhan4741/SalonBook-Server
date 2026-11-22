import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { authenticate, checkBlockedUser } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, checkBlockedUser, getProfile);
router.patch("/", authenticate, checkBlockedUser, updateProfile);

export default router;
