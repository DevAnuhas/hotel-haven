import mongoose from "mongoose";
const { Schema } = mongoose;

import { RoomSchema } from "./Room";
import { ReviewSchema } from "./Review";

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
		amenities: {
			general: [String], // WiFi, Parking, etc.
			wellness: [String], // Spa, Gym, etc.
			food: [String], // Restaurant, Bar, etc.
			services: [String], // Room Service, Concierge, etc.
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
		reviews: [ReviewSchema],
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
		features: {
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

// Create indexes for common search queries
/* HotelSchema.index({
	"location.address.city": 1,
	"location.address.country": 1,
});
HotelSchema.index({
	"features.breakfastIncluded": 1,
	"features.freeAirportShuttle": 1,
});
HotelSchema.index({ "rating.average": -1 });
HotelSchema.index({ "pricing.basePrice": 1 });

// Virtual for calculating the display price based on base price and tax
HotelSchema.virtual("displayPrice").get(function () {
	const basePrice = this.pricing.basePrice;
	return this.pricing.includeTaxInDisplay
		? basePrice * (1 + this.pricing.taxRate)
		: basePrice;
});

// Method to check availability for a date range
HotelSchema.methods.checkAvailability = function (
	startDate,
	endDate,
	roomType,
	guests
) {
	// This would be implemented to check against a separate Booking collection
	// For now, just returning true as a placeholder
	return true;
};

// Create and export the model
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);

export default Hotel;

// Example usage:
const newHotel = new Hotel({
	name: "Hotel Norrebro",
	description: "A beautiful hotel in the heart of Copenhagen",
	location: {
		address: {
			city: "Copenhagen",
			country: "Denmark",
		},
		coordinates: {
			coordinates: [12.5683, 55.6761], // longitude, latitude
		},
		distanceFromCenter: 0.4,
	},
	starRating: 4,
	amenities: {
		general: ["Free WiFi", "24-hour front desk", "Elevator"],
		food: ["Restaurant", "Bar", "Breakfast"],
	},
	features: {
		breakfastIncluded: true,
		freeWifi: true,
	},
	rooms: [
		{
			type: "Comfort",
			name: "Comfort King Room",
			bedType: "king size",
			maxOccupancy: 2,
			basePrice: 180,
		},
	],
	rating: {
		average: 9.6,
		count: 1920,
		category: "Excellent",
	},
	tags: ["hot deal", "Popular"],
});

console.log(newHotel); */
