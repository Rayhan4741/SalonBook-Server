import { Request, Response, NextFunction } from 'express';
export function apiDeprecationWarning(sunsetDate?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-API-Version', '1.1.0');
    if (sunsetDate) res.setHeader('Sunset', sunsetDate);
    next();
  };
}
