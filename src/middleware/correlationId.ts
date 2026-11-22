import { Request, Response, NextFunction } from "express";

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.headers["x-request-id"];
  const correlationId = (typeof existingId === "string" ? existingId : null) || `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  res.setHeader("X-Request-ID", correlationId);
  next();
}
