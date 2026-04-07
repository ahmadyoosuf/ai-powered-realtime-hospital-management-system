import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return; // Already connected
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const conn = await mongoose.connect(uri as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    if (!process.env.VERCEL) {
      process.exit(1); // Exit process with failure (only in non-serverless)
    }
    throw error;
  }
};
