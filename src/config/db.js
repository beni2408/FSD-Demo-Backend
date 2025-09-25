import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DB Connected");
  } catch (err) {
    console.stack(err);
    process.exit(1);
  }
};

export default connectDB;
