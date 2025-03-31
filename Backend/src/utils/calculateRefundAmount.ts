import { differenceInDays } from "date-fns";
import NotAllowedError from "../domain/errors/not-allowed-error";
import Booking from "../infrastructure/schemas/Booking";

export const calculateRefundAmount = async (
	bookingId: string
): Promise<number> => {
	try {
		// Fetch the cancellation policies
		const booking = await Booking.findById(bookingId).populate(
			"hotelId",
			"policies"
		);
		if (!booking) {
			throw new Error("Booking not found");
		}

		const hotel = booking.hotelId as any; // Cast to any to access hotel fields
		if (!hotel || !hotel.policies || !hotel.policies.cancellation) {
			throw new Error("Hotel cancellation policy not found");
		}

		const { freeCancellation, daysBeforeCheckIn, penaltyFee } =
			hotel.policies.cancellation;
		const checkInDate = new Date(booking.checkInDate);
		const currentDate = new Date();
		const currentStatus = booking.status;

		// Calculate days before check-in
		const daysDifference = differenceInDays(checkInDate, currentDate);

		// Check booking status for refund eligibility
		if (currentStatus === "pending") {
			return 0;
		}
		if (currentStatus !== "confirmed") {
			throw new NotAllowedError(
				"Cancellations are only allowed for confirmed bookings :)"
			);
		}

		// Determine refund amount
		if (freeCancellation && daysDifference >= daysBeforeCheckIn) {
			return booking.price; // Full refund
		}

		// Apply penalty fee
		const refundAmount = booking.price - penaltyFee;
		return refundAmount > 0 ? refundAmount : 0; // Ensure refund is not negative
	} catch (error) {
		console.error("Error calculating refund amount:", error);
		throw error;
	}
};
