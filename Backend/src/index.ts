import "dotenv/config";
import connectDB from "./infrastructure/db";
import express from "express";
import cors from "cors";

import hotelRouter from "./api/hotel";
import userRouter from "./api/user";
import bookingRouter from "./api/booking";

// Create an Express instance
const app = express();

// Middleware to parse JSON data in the request body
app.use(express.json());

// Middleware to enable CORS
const corsOptions = {
	origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

connectDB();

app.use("/api/hotel", hotelRouter);
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);

// Define the port to run the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
