import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
	{
		hotelId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		roomId: {
			type: Number,
			ref: "Room",
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		checkInDate: {
			type: Date,
			required: true,
		},
		checkOutDate: {
			type: Date,
			required: true,
		},
		adults: {
			type: Number,
			required: true,
		},
		children: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		tax: {
			type: Number,
			default: 0,
		},
		specialRequests: {
			type: String,
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "completed", "cancelled", "archived"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
