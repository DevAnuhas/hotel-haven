import { useState } from "react";
import { useParams, Link } from "react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, StarIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import BeatLoader from "react-spinners/BeatLoader";
import {
	useGetBookingByIdQuery,
	useCancelBookingMutation,
	useArchiveBookingMutation,
	useCreateReviewMutation,
} from "@/lib/api";
import { cancelBookingUtil, archiveBookingUtil } from "@/utils/bookingUtils";
import BookingStatus from "@/components/BookingStatus";
import BookingActions from "@/components/BookingActions";
import CancelBookingDialog from "@/components/CancelBookingDialog";
import ReviewDialog from "@/components/ReviewDialog";
import CancellationPolicy from "@/components/CancellationPolicy";
import { toast } from "sonner";

export default function BookingDetailsPage() {
	const { id } = useParams();
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
	const [cancellationReason, setCancellationReason] = useState("");
	const [rating, setRating] = useState(10);
	const [reviewTitle, setReviewTitle] = useState("");
	const [reviewComment, setReviewComment] = useState("");

	const { data: booking, isLoading, isError } = useGetBookingByIdQuery(id);
	const [cancelBooking] = useCancelBookingMutation();
	const [archiveBooking] = useArchiveBookingMutation();
	const [createReview] = useCreateReviewMutation();

	if (isLoading) {
		return (
			<div className="container mx-auto py-10 h-screen flex items-center justify-center text-center">
				<BeatLoader loading size={20} />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto py-10 h-screen flex flex-col items-center justify-center text-center">
				<h1 className="text-2xl font-bold mb-4">
					Error Loading Booking Information
				</h1>
				<p className="mb-6">
					The booking you&apos;re looking for could not be found.
				</p>
				<Link to="/account">
					<Button>Return to Account</Button>
				</Link>
			</div>
		);
	}

	const stars = Array(booking.hotel?.starRating || 0).fill(0);
	const nights = Math.round(
		(new Date(booking.checkOutDate).getTime() -
			new Date(booking.checkInDate).getTime()) /
			(1000 * 60 * 60 * 24)
	);

	const handleCancelBooking = async () => {
		try {
			await cancelBookingUtil(cancelBooking, id, cancellationReason);
			toast.success("Booking cancelled successfully!");
			setIsCancelDialogOpen(false);
			setCancellationReason("");
		} catch {
			toast.error("Unable to cancel booking");
		}
	};

	const handleArchiveBooking = async () => {
		try {
			await archiveBookingUtil(archiveBooking, id);
			toast.success("Booking archived successfully!");
		} catch {
			toast.error("Unable to archive booking");
		}
	};

	const handleSubmitReview = async () => {
		try {
			await createReview({
				hotelId: booking?.hotel?._id,
				bookingId: id,
				rating,
				title: reviewTitle,
				comment: reviewComment,
			}).unwrap();
			toast.success("Review submitted successfully!");
			setIsReviewDialogOpen(false);
			setReviewComment("");
			setReviewTitle("");
		} catch {
			toast.error("Unable to submit review");
		}
	};

	const handlePayNow = () => {
		// Placeholder for payment logic (not provided in AccountPage, so left as a TODO)
		toast.info("Payment functionality not yet implemented.");
	};

	return (
		<div className="container w-full py-16 px-8 mt-12 mx-auto max-w-4xl">
			<div className="flex items-center mb-6">
				<Button variant="ghost" size="sm" asChild className="mr-2">
					<Link to="/account">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Account
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">Booking Details</h1>
			</div>

			<Card className="mb-6">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle>Booking Reference</CardTitle>
						<CardDescription>{booking.id}</CardDescription>
					</div>
					<BookingStatus
						status={booking.status}
						refundAmount={booking.refundAmount}
					/>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row gap-6 items-start">
						<div className="relative flex items-center h-64 md:h-32 w-full md:w-48 rounded-md overflow-hidden">
							<img
								src={booking.hotel?.image || "/placeholder.svg"}
								alt={booking.hotel?.name || "Hotel"}
								className="object-cover h-full w-full"
							/>
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<h2 className="text-xl font-bold">{booking.hotel?.name}</h2>
								<div className="flex items-center">
									{stars.map((_, i) => (
										<StarIcon
											key={i}
											className="h-4 w-4 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
							</div>
							<div className="flex items-center text-sm text-muted-foreground mb-4">
								<MapPinIcon className="h-4 w-4 mr-1" />
								<span>
									{booking.hotel?.location.city},{" "}
									{booking.hotel?.location.country}
								</span>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-2">
									<CalendarIcon className="h-4 w-4 text-muted-foreground" />
									<div className="text-sm">
										<p className="font-medium">
											{format(
												new Date(booking.checkInDate),
												"EEE, MMM d, yyyy"
											)}{" "}
											-{" "}
											{format(
												new Date(booking.checkOutDate),
												"EEE, MMM d, yyyy"
											)}
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
										{booking.status === "confirmed"
											? "Total paid:"
											: "Payment due:"}{" "}
										${booking.price.toFixed(2)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<Card>
					<CardHeader>
						<CardTitle>Stay Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="text-sm font-medium mb-2">Check-in Information</h3>
							<div className="text-sm space-y-1">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Date:</span>
									<span>
										{format(new Date(booking.checkInDate), "EEE, MMM d, yyyy")}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Time:</span>
									<span>{booking.hotel?.policies.checkInTime}</span>
								</div>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-medium mb-2">
								Check-out Information
							</h3>
							<div className="text-sm space-y-1">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Date:</span>
									<span>
										{format(new Date(booking.checkOutDate), "EEE, MMM d, yyyy")}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Time:</span>
									<span>{booking.hotel?.policies.checkOutTime}</span>
								</div>
							</div>
						</div>
						<div>
							<h3 className="text-sm font-medium mb-2">Room Information</h3>
							<div className="text-sm space-y-1">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Room Type:</span>
									<span>{booking.hotel?.room?.name}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Bed Type:</span>
									<span>
										{booking.hotel?.room?.bedCount}{" "}
										{booking.hotel?.room?.bedType}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Max Occupancy:</span>
									<span>{booking.hotel?.room?.maxOccupancy} guests</span>
								</div>
							</div>
						</div>
						{booking.specialRequests && (
							<div>
								<h3 className="text-sm font-medium mb-2">Special Requests</h3>
								<p className="text-sm p-3 bg-muted rounded-md">
									{booking.specialRequests}
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payment Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="text-sm font-medium mb-2">Payment Summary</h3>
							<div className="text-sm space-y-1">
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										Room rate ({nights} {nights === 1 ? "night" : "nights"}):
									</span>
									<span>${(booking.price - booking.tax).toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Taxes & fees:</span>
									<span>${booking.tax.toFixed(2)}</span>
								</div>
								<Separator className="my-1" />
								<div className="flex justify-between font-medium">
									<span>Total:</span>
									<span>${booking.price.toFixed(2)}</span>
								</div>
							</div>
						</div>
						{booking.status === "cancelled" && booking.refundAmount && (
							<div>
								<h3 className="text-sm font-medium mb-2">Refund Information</h3>
								<div className="text-sm space-y-1">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Refund Amount:
										</span>
										<span>${booking.refundAmount.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Refund ID:</span>
										<span>{booking.refundId}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Refund Date:</span>
										<span>
											{format(new Date(booking.updatedAt), "MMM d, yyyy")}
										</span>
									</div>
								</div>
							</div>
						)}
						<div>
							<h3 className="text-sm font-medium mb-2">Cancellation Policy</h3>
							<div className="text-sm p-3 bg-muted rounded-md">
								<CancellationPolicy selectedBooking={booking} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<BookingActions
				booking={booking}
				onCancel={() => setIsCancelDialogOpen(true)}
				onArchive={handleArchiveBooking}
				onReview={() => setIsReviewDialogOpen(true)}
				onPay={handlePayNow}
				hideViewDetails={true}
			/>

			<CancelBookingDialog
				isOpen={isCancelDialogOpen}
				onOpenChange={setIsCancelDialogOpen}
				selectedBooking={booking}
				cancellationReason={cancellationReason}
				setCancellationReason={setCancellationReason}
				onCancel={handleCancelBooking}
			/>

			<ReviewDialog
				isOpen={isReviewDialogOpen}
				onOpenChange={setIsReviewDialogOpen}
				selectedBooking={booking}
				rating={rating}
				setRating={setRating}
				reviewTitle={reviewTitle}
				setReviewTitle={setReviewTitle}
				reviewComment={reviewComment}
				setReviewComment={setReviewComment}
				onSubmit={handleSubmitReview}
			/>
		</div>
	);
}
