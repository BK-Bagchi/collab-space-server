import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//database connection
const dbConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cnnt2a4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("✅ MongoDB database connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

export default dbConnection;
