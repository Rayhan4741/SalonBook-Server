import { Request, Response, NextFunction } from "express";

export function timingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const originalWriteHead = res.writeHead;
  res.writeHead = function (...args: any[]) {
    const duration = Date.now() - start;
    try {
      if (!res.headersSent) {
        res.setHeader("X-Response-Time", `${duration}ms`);
      }
    } catch {
      // Ignore if headers already dispatched
    }
    return originalWriteHead.apply(res, args as any);
  };
  next();
}
