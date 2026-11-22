import { Router } from "express";
import { uploadMiddleware, uploadImage } from "../controllers/uploadController";
import { authenticate, checkBlockedUser } from "../middleware/authMiddleware";

const router = Router();

// Upload image (service image or profile image)
router.post(
  "/image",
  authenticate,
  checkBlockedUser,
  uploadMiddleware.single("image"),
  uploadImage
);

export default router;
