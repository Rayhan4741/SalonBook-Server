import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "../config/env";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "healthy",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

export default router;
