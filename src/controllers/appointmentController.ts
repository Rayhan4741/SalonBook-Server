import { Response } from "express";
import mongoose from "mongoose";
import { Appointment } from "../models/Appointment";
import { Service } from "../models/Service";
import { AuthRequest } from "../middleware/authMiddleware";

export const VALID_TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

// Helper to check valid date format and prevent past dates
const isValidFutureDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const inputDate = new Date(`${dateStr}T00:00:00`);
  if (isNaN(inputDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

// Customer: Create appointment request
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { serviceId, appointmentDate, timeSlot, message } = req.body;

    if (!serviceId || !appointmentDate || !timeSlot) {
      res.status(400).json({
        success: false,
        message: "serviceId, appointmentDate, and timeSlot are required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      res.status(400).json({ success: false, message: "Invalid service ID provided." });
      return;
    }

    if (!isValidFutureDate(appointmentDate)) {
      res.status(400).json({
        success: false,
        message: "Appointment date must be a valid upcoming date (cannot book past dates).",
      });
      return;
    }

    if (!VALID_TIME_SLOTS.includes(timeSlot.trim())) {
      res.status(400).json({
        success: false,
        message: `Invalid time slot. Allowed slots: ${VALID_TIME_SLOTS.join(", ")}`,
      });
      return;
    }

    // Verify service exists and is active
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ success: false, message: "Service does not exist." });
      return;
    }

    if (service.status !== "active") {
      res.status(400).json({
        success: false,
        message: "This service is currently inactive and cannot be booked.",
      });
      return;
    }

    // Check for existing active appointment on this date and time slot
    const existingActiveBooking = await Appointment.findOne({
      appointmentDate: appointmentDate.trim(),
      timeSlot: timeSlot.trim(),
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingActiveBooking) {
      res.status(409).json({
        success: false,
        message: `The time slot '${timeSlot}' on ${appointmentDate} is already booked. Please choose a different time.`,
      });
      return;
    }

    // Store server-side snapshot price (Never trust frontend price)
    const newAppointment = await Appointment.create({
      serviceId: service._id,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      appointmentDate: appointmentDate.trim(),
      timeSlot: timeSlot.trim(),
      message: (message || "").trim(),
      servicePrice: service.price,
      paymentStatus: "unpaid",
      status: "pending",
    });

    const populatedAppointment = await Appointment.findById(newAppointment._id).populate("serviceId");

    res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully. Pending salon confirmation.",
      data: populatedAppointment,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "A booking conflict occurred. That slot has just been reserved. Please pick another slot.",
      });
      return;
    }
    res.status(500).json({ success: false, message: error.message || "Failed to submit appointment" });
  }
};

// Customer: Get my appointments
export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const appointments = await Appointment.find({ customerId: user.id })
      .populate("serviceId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve your appointments" });
  }
};

// Customer / Admin: Get appointment by ID
export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid appointment ID." });
      return;
    }

    const appointment = await Appointment.findById(id).populate("serviceId");
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    // Authorization: customer can only see their own appointment; admin can view all
    if (user.role !== "admin" && appointment.customerId !== user.id) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view this appointment.",
      });
      return;
    }

    res.json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch appointment" });
  }
};

// Customer: Cancel pending appointment
export const cancelMyAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid appointment ID." });
      return;
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    // Ownership check
    if (appointment.customerId !== user.id) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You cannot cancel another customer's appointment.",
      });
      return;
    }

    // Status check: Customers can cancel only their own pending appointments
    if (appointment.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Cannot cancel an appointment with status '${appointment.status}'. Customers can only cancel pending requests.`,
      });
      return;
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to cancel appointment" });
  }
};

// Admin: Get all appointments
export const getAdminAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, date, search } = req.query;
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (date) {
      filter.appointmentDate = date;
    }

    if (search && typeof search === "string" && search.trim()) {
      filter.$or = [
        { customerName: { $regex: search.trim(), $options: "i" } },
        { customerEmail: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const appointments = await Appointment.find(filter)
      .populate("serviceId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve appointments" });
  }
};

// Admin: Confirm appointment
export const confirmAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid appointment ID." });
      return;
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    if (appointment.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Only pending appointments can be confirmed. Current status: ${appointment.status}`,
      });
      return;
    }

    // Check slot conflict before confirming
    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      status: "confirmed",
    });

    if (conflict) {
      res.status(409).json({
        success: false,
        message: `Another appointment is already confirmed for ${appointment.appointmentDate} at ${appointment.timeSlot}.`,
      });
      return;
    }

    appointment.status = "confirmed";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment confirmed successfully.",
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to confirm appointment" });
  }
};

// Admin: Cancel appointment (pending or confirmed)
export const cancelAdminAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid appointment ID." });
      return;
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    if (appointment.status === "cancelled") {
      res.status(400).json({
        success: false,
        message: "Appointment is already cancelled.",
      });
      return;
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled by administrator.",
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to cancel appointment" });
  }
};
