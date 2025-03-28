import mongoose from "mongoose";
const { Schema } = mongoose;

export const ReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 10,
	},
	title: String,
	comment: String,
	date: {
		type: Date,
		default: Date.now,
	},
	verified: {
		type: Boolean,
		default: false,
	},
});
