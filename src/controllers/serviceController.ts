import { Request, Response } from "express";
import mongoose from "mongoose";
import { Service } from "../models/Service";
import { Appointment } from "../models/Appointment";
import { AuthRequest } from "../middleware/authMiddleware";

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sort, status, page = 1, limit = 50 } = req.query;

    const query: any = {};

    // By default, public only sees active services
    if (status && status !== "all") {
      query.status = status;
    } else if (!status) {
      query.status = "active";
    }

    if (category && category !== "All" && category !== "all") {
      query.category = category;
    }

    if (search && typeof search === "string" && search.trim()) {
      query.serviceName = { $regex: search.trim(), $options: "i" };
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc") {
      sortOptions = { price: -1 };
    } else if (sort === "duration_asc") {
      sortOptions = { duration: 1 };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [services, total] = await Promise.all([
      Service.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Service.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: services,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch services" });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid service identifier format." });
      return;
    }

    const service = await Service.findById(id);
    if (!service) {
      res.status(404).json({ success: false, message: "Service not found or no longer available." });
      return;
    }

    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve service" });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceName, category, description, price, duration, image, status } = req.body;

    if (!serviceName || !category || !description || price === undefined || !duration || !image) {
      res.status(400).json({
        success: false,
        message: "All fields are required: serviceName, category, description, price, duration, image.",
      });
      return;
    }

    const numericPrice = Number(price);
    const numericDuration = Number(duration);

    if (isNaN(numericPrice) || numericPrice < 0) {
      res.status(400).json({ success: false, message: "Price must be a non-negative number." });
      return;
    }

    if (isNaN(numericDuration) || numericDuration <= 0) {
      res.status(400).json({ success: false, message: "Duration must be greater than 0 minutes." });
      return;
    }

    const service = await Service.create({
      serviceName: serviceName.trim(),
      category: category.trim(),
      description: description.trim(),
      price: numericPrice,
      duration: numericDuration,
      image: image.trim(),
      status: status === "inactive" ? "inactive" : "active",
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to create service" });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid service identifier." });
      return;
    }

    const { serviceName, category, description, price, duration, image, status } = req.body;

    const updateData: any = {};
    if (serviceName !== undefined) updateData.serviceName = serviceName.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) {
      const p = Number(price);
      if (isNaN(p) || p < 0) {
        res.status(400).json({ success: false, message: "Price must be a non-negative number." });
        return;
      }
      updateData.price = p;
    }
    if (duration !== undefined) {
      const d = Number(duration);
      if (isNaN(d) || d <= 0) {
        res.status(400).json({ success: false, message: "Duration must be greater than 0." });
        return;
      }
      updateData.duration = d;
    }
    if (image !== undefined) updateData.image = image.trim();
    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        res.status(400).json({ success: false, message: "Status must be 'active' or 'inactive'." });
        return;
      }
      updateData.status = status;
    }

    const updated = await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      res.status(404).json({ success: false, message: "Service not found." });
      return;
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update service" });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid service ID." });
      return;
    }

    const service = await Service.findById(id);
    if (!service) {
      res.status(404).json({ success: false, message: "Service not found." });
      return;
    }

    // Check if there are associated appointments to protect historical integrity
    const appointmentCount = await Appointment.countDocuments({ serviceId: id });

    if (appointmentCount > 0) {
      // Safe deactivation to preserve appointment & transaction history
      service.status = "inactive";
      await service.save();

      res.json({
        success: true,
        message: "Service has historical appointments and was safely deactivated rather than deleted to preserve records.",
        data: service,
        action: "deactivated",
      });
      return;
    }

    // No existing appointments, safe hard delete
    await Service.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Service permanently removed.",
      action: "deleted",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to delete service" });
  }
};
