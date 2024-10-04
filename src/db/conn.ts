import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB: string = process.env.DATABASE || "";

mongoose.set('strictQuery', false);

mongoose.connect(DB)
  .then(() => console.log("🚀 DaaBase Connected"))
  .catch((err: Error) => {
    console.error("❌ DataBase Connection Error:", err);
  });

export default mongoose.connection;