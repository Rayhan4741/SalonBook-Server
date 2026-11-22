import { CorsOptions } from "cors";
import { config } from "./env";

export const corsOptions: CorsOptions = {
  origin: [config.clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "stripe-signature"],
};
