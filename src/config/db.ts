import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { config } from "./env";

let nativeClient: MongoClient | null = null;

export const connectDB = async (): Promise<{ mongooseConn: typeof mongoose; nativeClient: MongoClient }> => {
  try {
    const mongooseConn = await mongoose.connect(config.mongodbUri);
    console.log(`✅ MongoDB Connected via Mongoose: ${mongooseConn.connection.host}`);

    nativeClient = new MongoClient(config.mongodbUri);
    await nativeClient.connect();
    console.log("✅ Native MongoDB client connected for Better Auth adapter");

    return { mongooseConn, nativeClient };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getNativeClient = () => {
  if (!nativeClient) {
    nativeClient = new MongoClient(config.mongodbUri);
  }
  return nativeClient;
};
