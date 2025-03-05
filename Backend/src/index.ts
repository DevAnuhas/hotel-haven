import "dotenv/config";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import connectDB from "./infrastructure/db";

import hotelRouter from "./api/hotel";
import userRouter from "./api/user";
import bookingRouter from "./api/booking";

import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";

// Create an Express instance
const app = express();

// Middleware to use Clerk authentication
app.use(clerkMiddleware());

// Middleware to parse JSON data in the request body
app.use(express.json());

// Middleware to enable CORS
const corsOptions = {
	origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

// Connect to the database
connectDB();

// Define the routes
app.use("/api/hotel", hotelRouter);
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);

// Middleware to handle errors
app.use(globalErrorHandlingMiddleware);

// Define the port to run the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
