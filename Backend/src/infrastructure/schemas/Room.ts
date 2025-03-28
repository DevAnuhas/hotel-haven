import mongoose from "mongoose";
const { Schema } = mongoose;

export const RoomSchema = new Schema({
	type: {
		type: String,
		required: true,
		enum: ["Standard", "Comfort", "Premium", "Deluxe", "Suite"],
	},
	name: {
		type: String,
		required: true,
	},
	description: String,
	bedType: {
		type: String,
		required: true,
		enum: ["single", "twin", "double", "queen size", "king size"],
	},
	bedCount: {
		type: Number,
		default: 1,
	},
	maxOccupancy: {
		type: Number,
		required: true,
		min: 1,
	},
	hasBathroom: {
		type: Boolean,
		default: true,
	},
	size: {
		type: Number, // in square meters/feet
		default: 0,
	},
	basePrice: {
		type: Number,
		required: true,
	},
	amenities: [String],
});
