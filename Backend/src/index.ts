import "dotenv/config";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import connectDB from "./infrastructure/db";

import hotelRouter from "./api/hotel";
import bookingRouter from "./api/booking";

import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";

// Create an Express instance
const app = express();

// Middleware to use Clerk authentication
app.use(clerkMiddleware());

// Middleware to parse JSON data in the request body
app.use(express.json());

// Middleware to enable
const corsOptions = {
	origin: process.env.CORS_ORIGIN,
};
app.use(cors(corsOptions));

// Connect to the database
connectDB();

// Define the routes
app.get("/", (req, res) => {
	res.send("API is running...");
});

// Define the API routes
app.use("/api/hotel", hotelRouter);
app.use("/api/booking", bookingRouter);

// Middleware to handle errors
app.use(globalErrorHandlingMiddleware);

// Define the port (Vercel will override this with its own PORT env variable)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
