import { Request, Response } from "express";
import multer from "multer";
import axios from "axios";
import { config } from "../config/env";
import { AuthRequest } from "../middleware/authMiddleware";

// Multer memory storage configuration
const storage = multer.memoryStorage();

// File filter: accept only image types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only JPEG, PNG, and WebP images are permitted."));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum limit
  },
  fileFilter,
});

// POST /api/uploads/image
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No image file provided for upload." });
      return;
    }

    if (!config.imgbbApiKey) {
      // In development or when no key is set yet, return a clear actionable message
      res.status(503).json({
        success: false,
        message: "IMGBB_API_KEY is not configured on the server. Please add IMGBB_API_KEY to server/.env to enable external image hosting.",
      });
      return;
    }

    const base64Image = req.file.buffer.toString("base64");
    const formData = new URLSearchParams();
    formData.append("image", base64Image);

    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${config.imgbbApiKey}`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 15000,
      }
    );

    if (imgbbResponse.data && imgbbResponse.data.data && imgbbResponse.data.data.url) {
      res.json({
        success: true,
        message: "Image uploaded successfully to ImgBB.",
        url: imgbbResponse.data.data.url,
        display_url: imgbbResponse.data.data.display_url || imgbbResponse.data.data.url,
        delete_url: imgbbResponse.data.data.delete_url,
      });
    } else {
      res.status(502).json({
        success: false,
        message: "Unexpected response from ImgBB image hosting service.",
      });
    }
  } catch (error: any) {
    console.error("ImgBB upload error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message || "Failed to upload image to ImgBB",
    });
  }
};
