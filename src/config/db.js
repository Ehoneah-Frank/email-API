import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.collection('contacts').dropIndex('email_1')
        .catch(() => console.log('Index did not exist'));

        console.log("Database connected successfully");
        
    } catch (error) {
        console.log("Error connecting to database", error.message);
        process.exit(1);
    }
}

export default dbConnection;