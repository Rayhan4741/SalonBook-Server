import { Request, Response, NextFunction } from "express";

export function timingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    res.setHeader("X-Response-Time", `${duration}ms`);
  });
  next();
}
