import { Request, Response, NextFunction } from 'express';
export function requestTimeoutMiddleware(timeoutMs = 15000) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(504).json({ success: false, message: 'Gateway Request Timeout' });
      }
    });
    next();
  };
}
