import { Request, Response, NextFunction } from 'express';
export function cspMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self'");
  next();
}
