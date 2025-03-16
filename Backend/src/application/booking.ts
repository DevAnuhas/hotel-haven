import Booking from "../infrastructure/schemas/Booking";
import { Request, Response, NextFunction } from "express";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateBookingDTO } from "../domain/dtos/booking";
import { clerkClient } from "@clerk/express";

// Create a new booking
export const createBooking = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const booking = CreateBookingDTO.safeParse(req.body);

		if (!booking.success) {
			throw new ValidationError("Please enter all required fields");
		}

		// TODO: Add user data to clerk if not exists
		/* 	const { userData } = {
			firstName: booking.data.firstName,
			lastName: booking.data.lastName,
			email: booking.data.email,
			phone: booking.data.phone,
		}; */

		// Add the booking
		await Booking.create({
			hotelId: booking.data.hotelId,
			userId: req.auth?.userId,
			checkInDate: booking.data.checkInDate,
			checkOutDate: booking.data.checkOutDate,
			roomType: booking.data.roomType,
			adults: booking.data.adults,
			children: booking.data.children,
			specialRequests: booking.data.specialRequests,
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

export const getAllBookings = async (req: Request, res: Response) => {
	const bookings = await Booking.find();

	if (!bookings) {
		throw new NotFoundError("No bookings found");
	}

	res.status(200).json(bookings);
	return;
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
		const bookingsWithUser = await Promise.all(
			bookings.map(async (el) => {
				const user = await clerkClient.users.getUser(el.userId);
				return {
					_id: el._id,
					user: {
						_id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.primaryEmailAddress?.emailAddress,
						phone: user.primaryPhoneNumber?.phoneNumber,
					},
					hotel: el.hotelId,
					checkInDate: el.checkInDate,
					checkOutDate: el.checkOutDate,
					roomType: el.roomType,
					adults: el.adults,
					children: el.children,
					specialRequests: el.specialRequests,
				};
			})
		);

		res.status(200).json(bookingsWithUser);
		return;
	} catch (error) {
		next(error);
	}
};
