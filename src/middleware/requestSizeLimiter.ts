import { Request, Response, NextFunction } from 'express';
export function enforcePayloadLimit(maxBytes = 5 * 1024 * 1024) {
  return (req: Request, res: Response, next: NextFunction) => {
    const len = req.headers['content-length'];
    if (len && parseInt(len, 10) > maxBytes) {
      return res.status(413).json({ success: false, message: 'Payload Too Large' });
    }
    next();
  };
}
