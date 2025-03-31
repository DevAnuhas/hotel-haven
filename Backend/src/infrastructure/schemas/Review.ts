import mongoose from "mongoose";
const { Schema } = mongoose;

export const ReviewSchema = new Schema({
	hotelId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Hotel",
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 10,
	},
	// TODO: Refactor to use a nested schema
	/* rating: {
		cleanliness: { type: Number, min: 1, max: 10 },
		comfort: { type: Number, min: 1, max: 10 },
		location: { type: Number, min: 1, max: 10 },
		facilities: { type: Number, min: 1, max: 10 },
		staff: { type: Number, min: 1, max: 10 },
		valueForMoney: { type: Number, min: 1, max: 10 },
	}, */
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

export default mongoose.model("Review", ReviewSchema);
