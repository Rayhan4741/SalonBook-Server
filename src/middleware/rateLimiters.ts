import rateLimit from "express-rate-limit";

export const checkoutRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 checkout sessions per 10 min
  message: { success: false, message: "Too many checkout requests. Please wait a few minutes." },
});

export const bookingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many appointment requests created. Please try again later." },
});
