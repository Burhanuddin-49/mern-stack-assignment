import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
  }
};

export default connectMongoDB;
