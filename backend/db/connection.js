import mongoose from "mongoose";

export async function getConnection() {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    return connection;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
