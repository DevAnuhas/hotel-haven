import mongoose from "mongoose";

const connectDB = async () => {
	const MONGODB_URI = process.env.MONGODB_URI;

	if (!MONGODB_URI) {
		throw new Error("Please set the MONGODB_URI environment variable");
	}
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to the database...");
	} catch (error) {
		console.log("Error connecting to the database...");
		console.error(error);
	}
};

export default connectDB;
