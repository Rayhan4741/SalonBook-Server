import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// GET /api/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const dbUser = await User.findById(user.id).select("-password");

    if (!dbUser) {
      res.status(404).json({ success: false, message: "User profile not found." });
      return;
    }

    res.json({
      success: true,
      data: dbUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve profile" });
  }
};

// PATCH /api/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { name, image, phone } = req.body;

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      res.status(404).json({ success: false, message: "User profile not found." });
      return;
    }

    // Never permit role or isBlocked modification from profile update
    if (name !== undefined && typeof name === "string" && name.trim()) {
      dbUser.name = name.trim();
    }
    if (image !== undefined && typeof image === "string") {
      dbUser.image = image.trim();
    }
    if (phone !== undefined && typeof phone === "string") {
      dbUser.phone = phone.trim();
    }

    await dbUser.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role,
        isBlocked: dbUser.isBlocked,
        phone: dbUser.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update profile" });
  }
};
