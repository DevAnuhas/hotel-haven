import mongoose from "mongoose";
const { Schema } = mongoose;

import { RoomSchema } from "./Room";

const HotelSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			city: {
				type: String,
				required: true,
				index: true,
			},
			country: {
				type: String,
				required: true,
				index: true,
			},
		},
		contact: {
			phone: String,
			email: String,
			website: String,
		},
		category: {
			type: String,
			enum: ["Budget", "Economy", "Midscale", "Upscale", "Luxury"],
			default: "Midscale",
		},
		starRating: {
			type: Number,
			min: 1,
			max: 5,
			default: 3,
		},
		policies: {
			checkInTime: String,
			checkOutTime: String,
			cancellation: {
				freeCancellation: Boolean,
				daysBeforeCheckIn: Number,
				penaltyFee: Number,
			},
			petsAllowed: Boolean,
			extraBedPolicy: String,
		},
		rooms: [RoomSchema],
		images: {
			main: String,
			gallery: [String],
		},
		rating: {
			// TODO: Refactor to use Review schema
			average: {
				type: Number,
				min: 0,
				max: 10,
				default: 0,
			},
			count: {
				type: Number,
				default: 0,
			},
			category: {
				type: String,
				enum: ["Poor", "Average", "Good", "Very Good", "Excellent"],
				default: "Good",
			},
			breakdown: {
				cleanliness: { type: Number, default: 0 },
				comfort: { type: Number, default: 0 },
				location: { type: Number, default: 0 },
				facilities: { type: Number, default: 0 },
				staff: { type: Number, default: 0 },
				valueForMoney: { type: Number, default: 0 },
			},
		},
		pricing: {
			currency: {
				type: String,
				default: "USD",
			},
			taxRate: {
				type: Number,
				default: 0,
			},
			includeTaxInDisplay: {
				type: Boolean,
				default: false,
			},
		},
		amenities: {
			breakfastIncluded: {
				type: Boolean,
				default: false,
				index: true,
			},
			freeAirportShuttle: {
				type: Boolean,
				default: false,
				index: true,
			},
			freeWifi: {
				type: Boolean,
				default: true,
			},
			freeParking: {
				type: Boolean,
				default: false,
			},
			swimmingPool: {
				type: Boolean,
				default: false,
			},
			petsAllowed: {
				type: Boolean,
				default: false,
			},
			restaurant: {
				type: Boolean,
				default: false,
			},
			bar: {
				type: Boolean,
				default: false,
			},
			gym: {
				type: Boolean,
				default: false,
			},
			spa: {
				type: Boolean,
				default: false,
			},
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Hotel", HotelSchema);
