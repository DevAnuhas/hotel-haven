import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1.0,
		max: 5.0,
	},
	reviews: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
});

const hotelModel = mongoose.model("Hotel", hotelSchema);
export default hotelModel;
