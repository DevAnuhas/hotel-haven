import { differenceInDays } from "date-fns";

const CancellationPolicy = ({ selectedBooking }) => {
	if (!selectedBooking?.hotel?.policies?.cancellation) {
		return <p>Cancellation policy information is unavailable.</p>;
	}

	const { freeCancellation, daysBeforeCheckIn, penaltyFee } =
		selectedBooking.hotel.policies.cancellation;
	const checkInDate = new Date(selectedBooking.checkInDate);
	const currentDate = new Date();
	const daysDifference = differenceInDays(checkInDate, currentDate);

	let cancellationMessage = "";
	if (freeCancellation && daysDifference >= daysBeforeCheckIn) {
		cancellationMessage = `Free cancellation until ${daysBeforeCheckIn} days before check-in.`;
	} else {
		cancellationMessage = `Cancellation will incur a $${penaltyFee} penalty fee.`;
	}

	return <p>{cancellationMessage}</p>;
};

export default CancellationPolicy;
