import { format } from "date-fns";
import { StarIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import BookingStatus from "@/components/BookingStatus";
import BookingActions from "@/components/BookingActions";

const BookingCard = ({ booking, onCancel, onArchive, onReview }) => {
	const nights = Math.round(
		(new Date(booking.checkOutDate) - new Date(booking.checkInDate)) /
			(1000 * 60 * 60 * 24)
	);

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden rounded-lg border">
			<div className="relative h-48 md:h-full">
				<img
					src={booking.hotel?.image || "./assets/placeholder.svg"}
					alt={booking.hotel?.name || "Hotel"}
					className="object-cover h-full w-full"
				/>
			</div>
			<div className="p-6 md:col-span-3">
				<div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-xl font-bold">{booking.hotel?.name}</h3>
							<div className="flex items-center">
								{Array(booking.hotel?.starRating || 0)
									.fill(0)
									.map((_, i) => (
										<StarIcon
											key={i}
											className="h-4 w-4 fill-yellow-400 text-yellow-400"
										/>
									))}
							</div>
						</div>
						<div className="flex items-center text-sm text-muted-foreground mt-1">
							<MapPinIcon className="h-4 w-4 mr-1" />
							<span>
								{booking.hotel?.location.city},{" "}
								{booking.hotel?.location.country}
							</span>
						</div>
					</div>
					<BookingStatus
						status={booking.status}
						refundAmount={booking.refundAmount}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div className="flex items-center gap-2">
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
						<div className="text-sm">
							<p className="font-medium">
								{format(new Date(booking.checkInDate), "EEE, MMM d, yyyy")} -{" "}
								{format(new Date(booking.checkOutDate), "EEE, MMM d, yyyy")}
							</p>
							<p className="text-muted-foreground">
								{nights} nights, {booking.room?.name}
							</p>
						</div>
					</div>
					<div className="text-sm">
						<p className="font-medium">
							{booking.adults} {booking.adults === 1 ? "adult" : "adults"}
							{booking.children > 0 &&
								`, ${booking.children} ${
									booking.children === 1 ? "child" : "children"
								}`}
						</p>
						<p className="text-muted-foreground">
							{booking.status === "pending" || booking.refundAmount === 0
								? "Payment due:"
								: "Total paid:"}{" "}
							${booking.price.toFixed(2)}
						</p>
					</div>
				</div>

				<BookingActions
					booking={booking}
					onCancel={onCancel}
					onArchive={onArchive}
					onReview={onReview}
				/>
			</div>
		</div>
	);
};

export default BookingCard;
