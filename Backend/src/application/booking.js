import Booking from "../infrastructure/schemas/Booking.js";
import User from "../infrastructure/schemas/User.js";

// Create a new booking
export const createBooking = async (req, res) => {
	const booking = req.body;

	// Validate the request data
	if (
		!booking.hotelId ||
		!booking.userId ||
		!booking.checkInDate ||
		!booking.checkOutDate ||
		!booking.roomNumber
	) {
		res.status(400).json({
			message: "Please enter all required fields",
		});
		return;
	}

	// Add the booking
	await Booking.create({
		hotelId: booking.hotelId,
		userId: booking.userId,
		checkInDate: booking.checkInDate,
		checkOutDate: booking.checkOutDate,
		roomNumber: booking.roomNumber,
	});

	// Return the response
	res.status(201).json({
		message: "Booking added successfully!",
	});
	return;
};

export const getAllBookings = async (req, res) => {
	const bookings = await Booking.find();

	if (!bookings) {
		res.status(404).json({
			message: "Booking not found",
		});
		return;
	}

	res.status(200).json(bookings);
	return;
};

export const getAllBookingsForHotel = async (req, res) => {
	try {
		const hotelId = req.params.hotelId;
		const bookings = await Booking.find({ hotelId: hotelId })
			.populate("userId", "name email")
			.populate("hotelId", "name location price");
		res.status(200).json(bookings);
		return;
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
