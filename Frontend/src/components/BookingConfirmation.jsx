import { useLocation, Link } from "react-router";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, StarIcon } from "lucide-react";
import BeatLoader from "react-spinners/BeatLoader";
import { useGetBookingByIdQuery } from "@/lib/api";

export default function BookingConfirmation() {
	const { search } = useLocation();
	const queryParams = new URLSearchParams(search);
	const bookingId = queryParams.get("bookingId") || "";

	const {
		data: booking,
		isLoading,
		isError,
		error,
	} = useGetBookingByIdQuery(bookingId);

	if (isLoading) {
		return (
			<div className="container mx-auto py-10 h-screen flex items-center justify-center text-center">
				<BeatLoader loading size={20} />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold mb-4">
					Error Loading Booking Information
				</h1>
				<p className="mb-6">{error.message || "An error occurred."}</p>
			</div>
		);
	}

	// If no booking ID is provided
	if (!bookingId) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
				<p className="mb-6">No booking information was found.</p>
				<Link to="/">
					<Button>Return to Home</Button>
				</Link>
			</div>
		);
	}

	// Calculate nights
	const nights =
		booking.checkInDate && booking.checkOutDate
			? Math.round(
					(new Date(booking.checkOutDate).getTime() -
						new Date(booking.checkInDate).getTime()) /
						(1000 * 60 * 60 * 24)
			  )
			: 0;

	// Generate star rating display
	const stars = booking && Array(booking.hotel.starRating).fill(0);

	return (
		<div className="container mx-auto max-w-3xl py-10">
			<div className="container max-w-4xl py-4">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
						<CheckCircle2 className="h-8 w-8 text-green-600" />
					</div>
					<h1 className="text-2xl font-bold">Booking Confirmed!</h1>
					<p className="text-muted-foreground mt-2">
						Your booking has been confirmed and we&apos;ve sent the details to
						your email.
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Booking Details</CardTitle>
						<CardDescription>
							Booking reference:{" "}
							<span className="font-medium">{booking.bookingId}</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col md:flex-row gap-4 items-start">
							<div className="relative h-24 w-32 rounded-md overflow-hidden">
								<img
									src={booking.hotel.image || "./assets/placeholder.svg"}
									alt={booking.hotel.name}
									className="object-cover"
								/>
							</div>
							<div>
								<h3 className="font-bold">{booking.hotel.name}</h3>
								<div className="flex items-center gap-1 mb-1">
									{stars.map((_, i) => (
										<StarIcon
											key={i}
											className="h-4 w-4 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<p className="text-sm text-muted-foreground">
									{booking.hotel.location.city},{" "}
									{booking.hotel.location.country}
								</p>
							</div>
						</div>

						<Separator />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h4 className="font-medium mb-2">Stay Information</h4>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Check-in:</span>
										<span>
											{format(
												new Date(booking.checkInDate),
												"EEE, MMM d, yyyy"
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Check-out:</span>
										<span>
											{format(
												new Date(booking.checkOutDate),
												"EEE, MMM d, yyyy"
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Room:</span>
										<span>{booking.hotel.room.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Guests:</span>
										<span>
											{booking.adults}{" "}
											{booking.adults === 1 ? "adult" : "adults"}
											{booking.children > 0
												? `, ${booking.children} ${
														booking.children === 1 ? "child" : "children"
												  }`
												: ""}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-medium mb-2">Payment Summary</h4>
								<div className="space-y-1 text-sm">
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
										<span>Total paid:</span>
										<span>${booking.price.toFixed(2)}</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button asChild className="w-full">
							<Link to="/account">View My Bookings</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>

			<div className="text-center text-sm text-muted-foreground">
				<p>
					Need help with your booking? Contact our support team at{" "}
					<a
						href="mailto:support@hotelhaven.com"
						className="text-primary hover:underline"
					>
						support@hotelhaven.com
					</a>
				</p>
			</div>
		</div>
	);
}
