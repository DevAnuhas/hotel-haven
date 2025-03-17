import { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { CreateBookingDTO } from "../domain/dtos/booking";
import Booking from "../infrastructure/schemas/Booking";
import AuthenticatedRequest from "../types/authenticated-request";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";

// Create a new booking
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
		await Booking.create({
			...booking.data,
			userId: userId,
		});

		// Return the response
		res.status(201).json({
			message: "Booking created successfully!",
		});
		return;
	} catch (error) {
		next(error);
	}
};

// Utility function to transform booking data response
export const transformBookingData = (bookings: Document[]) => {
	return Promise.all(
		bookings.map((el: any) => {
			return {
				_id: el._id,
				user: {
					_id: el.userId,
					firstName: el.firstName,
					lastName: el.lastName,
					email: el.email,
					phone: el.phone,
				},
				hotel: el.hotelId,
				checkInDate: el.checkInDate,
				checkOutDate: el.checkOutDate,
				roomType: el.roomType,
				adults: el.adults,
				children: el.children,
				specialRequests: el.specialRequests,
				status: el.status,
				createdAt: el.createdAt,
				updatedAt: el.updatedAt,
			};
		})
	);
};

export const getAllBookings = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bookings = await Booking.find();

	if (!bookings) {
		throw new NotFoundError("No bookings found");
	}

	try {
		const bookings = await Booking.find().populate(
			"hotelId",
			"name location price"
		);
		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
		return;
	} catch (error) {
		next(error);
	}
};

export const getAllBookingsForHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const hotelId = req.params.hotelId;
		const bookings = await Booking.find({ hotelId: hotelId }).populate(
			"hotelId",
			"name location price"
		);
		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
		return;
	} catch (error) {
		next(error);
	}
};

export const getAllBookingsForUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.params.userId;
		const bookings = await Booking.find({ userId: userId }).populate(
			"hotelId",
			"name location price"
		);
		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
		return;
	} catch (error) {
		next(error);
	}
};
