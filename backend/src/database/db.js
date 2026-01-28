import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error("Database disconnection error:", error);
    process.exit(1);
  }
};

export const getDBConnectionStatus = () => {
  return mongoose.connection.readyState;
};
