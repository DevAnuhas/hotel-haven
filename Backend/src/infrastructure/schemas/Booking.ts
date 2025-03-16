import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
	hotelId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Hotel",
		required: true,
	},
	userId: {
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
	roomType: {
		type: String,
		required: true,
	},
	adults: {
		type: String,
		required: true,
	},
	children: {
		type: Number,
		required: true,
	},
	specialRequests: {
		type: String,
	},
});

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
