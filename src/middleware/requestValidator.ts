import { Request, Response, NextFunction } from "express";
import { validateRequiredFields } from "../utils/validator";

export function requireFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const error = validateRequiredFields(req.body, fields);
    if (error) {
      res.status(400).json({ success: false, message: error });
      return;
    }
    next();
  };
}
