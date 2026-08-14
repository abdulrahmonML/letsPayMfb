import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CONNECTDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default CONNECTDB;
