import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log("MongoDB connected");
    }catch(err){
        console.error("Error occured while connecting to MongoDB", err);
        process.exit(1);
    }
};

export default connectDB;
