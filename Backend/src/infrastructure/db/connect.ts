import mongoose from "mongoose";
import "dotenv/config";
import ora from "ora";

const connectDB = async () => {
	const MONGODB_URI = process.env.MONGODB_URI;

	if (!MONGODB_URI) {
		throw new Error("Please set the MONGODB_URI environment variable");
	}

	const spinner = ora("Connecting to MongoDB...").start();

	try {
		await mongoose.connect(MONGODB_URI);
		spinner.succeed("[SUCCESS] Connected to MongoDB");
	} catch (error) {
		spinner.fail("[ERROR] Failed to connect to MongoDB");
		console.error("[ERROR DETAILS]", error);
		throw error;
	}
};

export default connectDB;
