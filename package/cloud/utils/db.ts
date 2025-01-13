import mongoose from "mongoose";

export const connectToDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/kogen";
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
