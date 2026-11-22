import { Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// Admin: Get all customers
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, role, isBlocked, page = 1, limit = 50 } = req.query;

    const query: any = {};

    if (role && role !== "all") {
      query.role = role;
    } else {
      query.role = "customer"; // Default view: customers
    }

    if (isBlocked !== undefined && isBlocked !== "all") {
      query.isBlocked = isBlocked === "true";
    }

    if (search && typeof search === "string" && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch users" });
  }
};

// Admin: Get user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch user" });
  }
};

// Admin: Block customer
export const blockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const adminUser = req.user!;

    if (id === adminUser.id) {
      res.status(400).json({
        success: false,
        message: "Action forbidden: Administrators cannot block their own account.",
      });
      return;
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (targetUser.role === "admin") {
      res.status(403).json({
        success: false,
        message: "Forbidden: Cannot block another administrator account.",
      });
      return;
    }

    targetUser.isBlocked = true;
    await targetUser.save();

    res.json({
      success: true,
      message: `User '${targetUser.name}' has been blocked from accessing the platform.`,
      data: targetUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to block user" });
  }
};

// Admin: Unblock customer
export const unblockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    targetUser.isBlocked = false;
    await targetUser.save();

    res.json({
      success: true,
      message: `User '${targetUser.name}' has been unblocked.`,
      data: targetUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to unblock user" });
  }
};
