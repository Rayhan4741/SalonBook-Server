import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found: [${req.method}] ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Global Error Handler:", err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  let message = err.message || "An unexpected internal server error occurred.";

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode === 500 && res.status(409);
    const field = Object.keys(err.keyValue || {})[0];
    if (field === "appointmentDate" || field === "timeSlot") {
      message = "This time slot is already booked for the selected date. Please choose another time.";
    } else {
      message = `Duplicate value error for field: ${field}`;
    }
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e: any) => e.message);
    message = errors.join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" ? { stack: err.stack } : {}),
  });
};
