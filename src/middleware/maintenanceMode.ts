import { Request, Response, NextFunction } from 'express';
let isMaintenance = false;
export function setMaintenanceMode(active: boolean) { isMaintenance = active; }
export function maintenanceMiddleware(req: Request, res: Response, next: NextFunction) {
  if (isMaintenance && !req.path.startsWith('/api/health')) {
    return res.status(503).json({ success: false, message: 'System under scheduled maintenance' });
  }
  next();
}
