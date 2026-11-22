import { config, validateEnv } from "./config/env";
import { connectDB } from "./config/db";
import { createApp } from "./app";

const startServer = async () => {
  try {
    validateEnv();

    console.log("Connecting to MongoDB...");
    await connectDB();

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`🚀 SalonBook Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`📡 Client URL: ${config.clientUrl}`);
      console.log(`🔐 Better Auth URL: ${config.betterAuthUrl}`);
    });

    const shutdown = async () => {
      console.log("Shutting down SalonBook server gracefully...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Fatal error during server startup:", error);
    process.exit(1);
  }
};

startServer();
