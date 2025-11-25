import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("📦 MongoDB Connected Successfully!");

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

export default connectDB;
