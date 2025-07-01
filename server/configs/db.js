import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database is connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/smartwheelz`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
