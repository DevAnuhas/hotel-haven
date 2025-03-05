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
	roomNumber: {
		type: Number,
		required: true,
	},
});

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
