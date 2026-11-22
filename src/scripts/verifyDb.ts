import mongoose from "mongoose";
import { config } from "../config/env";

export async function verifyDatabaseConnectivity(): Promise<boolean> {
  try {
    console.log("Verifying MongoDB connectivity...");
    await mongoose.connect(config.mongodbUri);
    console.log("Database connected successfully!");
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.error("Database connection failure:", err);
    return false;
  }
}

if (require.main === module) {
  verifyDatabaseConnectivity();
}
