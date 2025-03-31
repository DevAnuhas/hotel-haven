import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../types/authenticated-request";
import ValidationError from "../domain/errors/validation-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import Booking from "../infrastructure/schemas/Booking";
import Review from "../infrastructure/schemas/Review";
import Hotel from "../infrastructure/schemas/Hotel";
import { CreateReviewDTO } from "../domain/dtos/review";
import { log } from "console";

export const createReview = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const review = CreateReviewDTO.safeParse(req.body);

		console.log(review.error);

		if (!review.success) {
			throw new ValidationError("Please enter all required fields");
		}

		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError("User authentication required");
		}

		// Create a new review document
		const savedReview = await Review.create({
			...review.data,
			userId: userId,
			verified: review.data.bookingId ? true : false,
		});

		// Optionally link to a booking
		if (review.data.bookingId) {
			await Booking.findByIdAndUpdate(
				review.data.bookingId,
				{ reviewId: savedReview._id },
				{ new: true }
			);
		}

		res.status(201).json({
			message: "Review created successfully!",
		});
	} catch (error) {
		next(error);
	}
};
