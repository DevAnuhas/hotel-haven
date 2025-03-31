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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	StarIcon,
	ArrowLeft,
	CalendarIcon,
	MapPinIcon,
	CheckCircle,
	XCircle,
	ArchiveIcon,
	Clock,
	CreditCard,
	MessageSquareMore,
} from "lucide-react";
import BeatLoader from "react-spinners/BeatLoader";
import { useGetBookingByIdQuery } from "@/lib/api";

export default function BookingDetailsPage() {
	const { id } = useParams();
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [cancellationReason, setCancellationReason] = useState("");

	const { data: booking, isLoading, isError } = useGetBookingByIdQuery(id);

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

	// Generate star rating display
	const stars = Array(booking.hotel?.starRating || 0).fill(0);

	// Calculate nights
	const nights = Math.round(
		(new Date(booking.checkOutDate).getTime() -
			new Date(booking.checkInDate).getTime()) /
			(1000 * 60 * 60 * 24)
	);

	// Handle booking cancellation
	const handleCancelBooking = () => {
		// TODO
	};

	// Handle booking archiving
	const handleArchiveBooking = () => {
		// TODO
	};

	// Get status icon
	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return <Clock className="h-5 w-5 text-yellow-500" />;
			case "confirmed":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "completed":
				return <CheckCircle className="h-5 w-5 text-blue-500" />;
			case "cancelled":
				return <XCircle className="h-5 w-5 text-red-500" />;
			case "archived":
				return <ArchiveIcon className="h-5 w-5 text-gray-500" />;
		}
	};

	return (
		<div className="container w-full py-16 mt-12 mx-auto max-w-4xl">
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
					<div className="flex items-center gap-2">
						<div>
							<CardTitle>Booking Reference</CardTitle>
							<CardDescription>{booking.id}</CardDescription>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{getStatusIcon(booking.status)}
						<div className="text-sm">
							<p className="font-medium">
								{booking.status === "pending" && "Awaiting payment"}
								{booking.status === "confirmed" && "Booking confirmed"}
								{booking.status === "completed" && "Stay completed"}
								{booking.status === "cancelled" && "Booking cancelled"}
								{booking.status === "archived" && "Booking archived"}
							</p>
							<p className="text-muted-foreground">
								{booking.status === "cancelled" &&
									booking.refundAmount &&
									`Refunded: $${booking.refundAmount.toFixed(2)}`}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="flex flex-col md:flex-row gap-6 items-start">
						<div className="relative h-32 w-full md:w-48 rounded-md overflow-hidden">
							<img
								src={booking.hotel?.image || "/placeholder.svg"}
								alt={booking.hotel?.name || "Hotel"}
								className="object-cover"
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
							<p className="text-sm p-3 bg-muted rounded-md">
								{/* TODO: Cancellation policy */}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-wrap gap-2 justify-end">
				{booking.status === "completed" || booking.status === "cancelled" ? (
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleArchiveBooking(booking._id)}
					>
						Archive Booking
					</Button>
				) : (
					(booking.status === "pending" || booking.status === "confirmed") && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								// setSelectedBookingId(booking._id);
								setIsCancelDialogOpen(true);
							}}
						>
							Cancel Booking
						</Button>
					)
				)}

				{booking.status === "pending" && (
					<Button
						size="sm"
						onClick={() => {
							// setSelectedBookingId(booking._id);
							// TODO: Implement payment for pending bookings
						}}
					>
						<CreditCard className="mr-1" />
						Pay Now
					</Button>
				)}

				{booking.status === "completed" && (
					<Button
						size="sm"
						onClick={() => {
							// setSelectedBookingId(booking._id);
							// setIsReviewDialogOpen(true);
						}}
						disabled={booking.reviewId}
					>
						<MessageSquareMore className="mr-1" />
						{!booking.reviewId ? "Leave Review" : "Review Submitted"}
					</Button>
				)}
			</div>

			{/* Cancel Booking Dialog */}
			<Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Cancel Booking</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel your booking at{" "}
							{booking.hotel?.name}?
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="bg-muted p-3 rounded-md text-sm">
							<h4 className="font-medium mb-1">Cancellation Policy</h4>
							{/* TODO: Cancellation policy */}
						</div>
						<div className="space-y-2">
							<Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
							<Textarea
								id="reason"
								placeholder="Please let us know why you're cancelling..."
								className="min-h-[100px]"
								value={cancellationReason}
								onChange={(e) => setCancellationReason(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCancelDialogOpen(false)}
						>
							Keep Booking
						</Button>
						<Button variant="destructive" onClick={handleCancelBooking}>
							Cancel Booking
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
