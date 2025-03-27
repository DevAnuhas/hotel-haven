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

// Utility function to generate booking ID
const generateBookingId = (booking: any) => {
	const { _id, checkInDate, hotel } = booking;
	const hotelCode = hotel.name.slice(0, 3).toUpperCase();
	const date = new Date(checkInDate);
	const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");
	const counter = parseInt(_id.toString().substring(20, 24), 16);
	return `${hotelCode}${dateStr}-${counter}`;
};

const calculateTotalPrice = (booking: any) => {
	const pricePerNight = booking.price || 0;

	// TODO: Add logic to handle different room types

	const checkIn = new Date(booking.checkInDate);
	const checkOut = new Date(booking.checkOutDate);
	const timeDiff = checkOut.getTime() - checkIn.getTime();
	const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
	const basePrice = pricePerNight * nights;

	const taxRate = 0.1; // 10% tax
	const tax = basePrice * taxRate;
	const serviceFee = 15;

	const totalPrice = basePrice + tax + serviceFee;

	return {
		nights,
		pricePerNight,
		basePrice,
		tax,
		serviceFee,
		totalPrice: Number(totalPrice.toFixed(2)),
	};
};

// Utility function to transform booking data response
export const transformBookingData = (bookings: any) => {
	return Promise.all(
		bookings.map((el: any) => {
			return {
				_id: el._id,
				bookingId: generateBookingId({
					_id: el._id,
					hotel: el.hotelId,
					checkInDate: el.checkInDate,
				}),
				pricing: calculateTotalPrice({
					price: el.hotelId.price,
					checkInDate: el.checkInDate,
					checkOutDate: el.checkOutDate,
				}),
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
		const bookings = await Booking.find()
			.populate("hotelId", "name location price image")
			.lean();
		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
		return;
	} catch (error) {
		next(error);
	}
};

export const getBookingsForHotel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
) => {
	try {
		const userId = req.params.userId;
		const bookings = await Booking.find({ userId: userId })
			.populate("hotelId", "name location price image")
			.sort({ createdAt: -1 })
			.lean();
		const bookingsWithAllData = await transformBookingData(bookings);
		res.status(200).json(bookingsWithAllData);
		return;
	} catch (error) {
		next(error);
	}
};

export const cancelBooking = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log(req.params.bookingId);
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
