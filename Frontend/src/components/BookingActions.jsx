import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { CreditCard, MessageSquareMore, ChevronRight } from "lucide-react";

const BookingActions = ({
	booking,
	onCancel,
	onArchive,
	onReview,
	onPay,
	hideViewDetails = false,
}) => {
	return (
		<div className="flex flex-wrap justify-start gap-2">
			{(booking.status === "completed" || booking.status === "cancelled") && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => onArchive(booking._id)}
				>
					Archive Booking
				</Button>
			)}
			{(booking.status === "pending" || booking.status === "confirmed") && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => onCancel(booking._id)}
				>
					Cancel Booking
				</Button>
			)}
			{!hideViewDetails && booking.status !== "archived" && (
				<Button size="sm" asChild>
					<Link to={`/account/booking-details/${booking._id}`}>
						View Details <ChevronRight />
					</Link>
				</Button>
			)}
			{booking.status === "pending" && (
				<Button size="sm" className="ml-auto" onClick={onPay}>
					<CreditCard className="mr-1" />
					Pay Now
				</Button>
			)}
			{booking.status === "completed" && (
				<Button
					size="sm"
					onClick={() => onReview(booking._id)}
					className="ml-auto"
					disabled={booking.reviewId}
				>
					<MessageSquareMore className="mr-1" />
					{!booking.reviewId ? "Leave Review" : "Review Submitted"}
				</Button>
			)}
		</div>
	);
};

export default BookingActions;
