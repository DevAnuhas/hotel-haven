import { Request, Response, NextFunction } from "express";
import { CreateBookingDTO } from "../domain/dtos/booking";
import Booking from "../infrastructure/schemas/Booking";
import AuthenticatedRequest from "../types/authenticated-request";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import { transformBookingData } from "../utils/transformBookingData";

export const createBooking = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const booking = CreateBookingDTO.safeParse(req.body);

		if (!booking.success) {
			throw new ValidationError("Please enter all required fields");
		}

		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError("User authentication required");
		}

		// Add the booking
		const createdBooking = await Booking.create({
			...booking.data,
			userId: userId,
		});

		res.status(201).json({
			message: "Booking created successfully!",
			bookingId: createdBooking._id,
		});
		return;
	} catch (error) {
		next(error);
	}
};

export const getBookingById = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const bookingId = req.params.bookingId;
		const bookings = await Booking.find({ _id: bookingId })
			.populate(
				"hotelId",
				"name location rooms images.main policies starRating"
			)
			.sort({ createdAt: -1 })
			.lean();

		if (!bookings.length) {
			res.status(404).json({ message: "Booking not found" });
		}

		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData[0]);
	} catch (error) {
		next(error);
	}
};

export const getAllBookings = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const bookings = await Booking.find()
			.populate("hotelId", "name location rooms images.main")
			.sort({ createdAt: -1 })
			.lean();

		if (!bookings.length) {
			res.status(404).json({ message: "Booking not found" });
		}

		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
	} catch (error) {
		next(error);
	}
};

export const getBookingsForHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const hotelId = req.params.hotelId;
		const bookings = await Booking.find({ hotelId: hotelId })
			.populate("hotelId", "name location price image")
			.lean();
		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
		return;
	} catch (error) {
		next(error);
	}
};

export const getBookingsForUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const userId = req.params.userId;
		const bookings = await Booking.find({ userId: userId })
			.populate("hotelId", "name location rooms images.main")
			.sort({ createdAt: -1 })
			.lean();
		if (!bookings.length) {
			res.status(404).json({ message: "Booking not found" });
		}

		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
	} catch (error) {
		next(error);
	}
};

export const updateBooking = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const bookingId = req.params.bookingId;
		const booking = await Booking.findById(bookingId);

		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		// TODO: Implement update booking logic

		res.status(200).json({
			message: "Booking updated successfully!",
		});
		return;
	} catch (error) {
		next(error);
	}
};

export const cancelBooking = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const bookingId = req.params.bookingId;
		const booking = await Booking.findById(bookingId);

		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		await Booking.findByIdAndUpdate(bookingId, { status: "cancelled" });

		res.status(200).json({
			message: "Booking cancelled successfully!",
		});
		return;
	} catch (error) {
		next(error);
	}
};

export const archiveBooking = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const bookingId = req.params.bookingId;
		const booking = await Booking.findById(bookingId);

		if (!booking) {
			throw new NotFoundError("Booking not found");
		}

		await Booking.findByIdAndUpdate(bookingId, { status: "archived" });

		res.status(200).json({
			message: "Booking archived successfully!",
		});
		return;
	} catch (error) {
		next(error);
	}
};
