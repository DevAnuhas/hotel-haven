import { toast } from "sonner";

/**
 * Cancels a booking using the provided mutation function.
 * @param {Function} cancelBookingMutation - RTK Query mutation function
 * @param {string} bookingId - ID of the booking to cancel
 * @param {string} reason - Reason for cancellation
 */
export const cancelBookingUtil = async (
	cancelBookingMutation,
	bookingId,
	reason
) => {
	const loadingToastId = toast.loading("Cancelling booking...");
	try {
		await cancelBookingMutation({ id: bookingId, reason }).unwrap();
		toast.dismiss(loadingToastId);
		toast.success("Booking cancelled successfully!");
	} catch {
		toast.dismiss(loadingToastId);
		toast.error("Unable to cancel booking");
	}
};

/**
 * Archives a booking using the provided mutation function.
 * @param {Function} archiveBookingMutation - RTK Query mutation function
 * @param {string} bookingId - ID of the booking to archive
 */
export const archiveBookingUtil = async (archiveBookingMutation, bookingId) => {
	const loadingToastId = toast.loading("Archiving booking...");
	try {
		await archiveBookingMutation(bookingId).unwrap();
		toast.dismiss(loadingToastId);
		toast.success("Booking archived successfully!");
	} catch {
		toast.dismiss(loadingToastId);
		toast.error("Unable to archive booking");
	}
};
