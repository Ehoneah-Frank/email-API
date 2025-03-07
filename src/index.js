import express from "express";
import dbConnection from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import contactRoute from "./routes/contactRoute.js";
import expressOasGenerator from "express-oas-generator";
import mongoose from "mongoose";



dotenv.config();
// Database connection
dbConnection();

const app = express();

expressOasGenerator.handleResponses(app, {
   alwaysServeDocs: true,
   tags: [ 'Contact Information' ],
   mongooseModels: mongoose.modelNames(), 
});



// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors({credentials: true, origin: '*'}));

// Routes
app.use("/api/contact", contactRoute);
expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});