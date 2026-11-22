import { Request, Response, NextFunction } from "express";

function cleanObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      cleanObject(obj[key]);
    }
  }
  return obj;
}

export function sanitizeMongoInputs(req: Request, res: Response, next: NextFunction): void {
  if (req.body) cleanObject(req.body);
  if (req.query) cleanObject(req.query);
  if (req.params) cleanObject(req.params);
  next();
}
