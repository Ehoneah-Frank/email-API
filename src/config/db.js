import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
        
    } catch (error) {
        console.log("Error connecting to database", error.message);
        process.exit(1);
    }
}

export default dbConnection;