import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
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
import { BookingForm } from "@/components/BookingForm";
import { StarIcon, ArrowLeft } from "lucide-react";
import { useGetHotelByIdQuery } from "@/lib/api";

export default function BookingPage() {
	const { search } = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(search);
	const { user, isLoaded } = useUser();

	const hotelId = queryParams.get("hotelId");
	const roomId = queryParams.get("roomId");
	const checkIn = queryParams.get("checkIn");
	const checkOut = queryParams.get("checkOut");
	const adults = queryParams.get("adults");
	const children = queryParams.get("children");
	const price = parseFloat(queryParams.get("price"));
	const tax = parseFloat(queryParams.get("tax"));

	const [bookingId, setBookingId] = useState(null);

	const {
		data: hotel,
		isLoading,
		isError,
		error,
	} = useGetHotelByIdQuery(hotelId);

	if (!user && isLoaded) {
		return <RedirectToSignIn />;
	}

	if (isLoading || !isLoaded) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold mb-4">Loading...</h1>
			</div>
		);
	}

	// If hotel or room not found
	if (!hotel || !hotel.rooms[roomId]) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
				<p className="mb-6">
					The hotel or room you&apos;re trying to book could not be found.
				</p>
				<Link to="/">
					<Button>Return to Home</Button>
				</Link>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold mb-4">Error Loading Hotel</h1>
				<p className="mb-6">{error.message || "An error occurred."}</p>
			</div>
		);
	}

	// Calculate nights
	const nights =
		checkIn && checkOut
			? Math.round(
					(new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
						(1000 * 60 * 60 * 24)
			  )
			: 0;

	// Generate star rating display
	const stars = hotel && Array(hotel.starRating).fill(0);

	// If booking is complete, redirect to confirmation page
	if (bookingId) {
		navigate(`/booking/confirmation?bookingId=${bookingId}`);
	}

	return (
		<div className="container mx-auto max-w-6xl py-8">
			<div className="flex items-center mb-6">
				<Button variant="ghost" size="sm" asChild className="mr-2">
					<Link to={`/hotel/${hotelId}`}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">Complete Your Booking</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Guest Information</CardTitle>
							<CardDescription>
								Please enter the guest details for this booking
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<BookingForm
								hotelId={hotelId}
								roomId={roomId}
								checkIn={checkIn}
								checkOut={checkOut}
								adults={adults}
								// eslint-disable-next-line react/no-children-prop
								children={children}
								price={price}
								tax={tax}
								onSuccess={(bookingId) => setBookingId(bookingId)}
							/>
						</CardContent>
					</Card>
				</div>

				<div className="lg:col-span-1">
					<Card className="sticky top-8">
						<CardHeader>
							<CardTitle>Booking Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-4 items-start">
								<div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
									<img
										src={hotel.images.main || "/placeholder.svg"}
										alt={hotel.name}
										className="object-cover"
									/>
								</div>
								<div>
									<h3 className="font-bold">{hotel.name}</h3>
									<div className="flex items-center gap-1">
										{stars.map((_, i) => (
											<StarIcon
												key={i}
												className="h-3 w-3 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<p className="text-sm text-muted-foreground">
										{hotel.location.city}, {hotel.location.country}
									</p>
								</div>
							</div>

							<Separator />

							<div>
								<h4 className="font-medium mb-2">Stay Details</h4>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Check-in:</span>
										<span>{format(new Date(checkIn), "EEE, MMM d, yyyy")}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Check-out:</span>
										<span>
											{format(new Date(checkOut), "EEE, MMM d, yyyy")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Length of stay:
										</span>
										<span>
											{nights} {nights === 1 ? "night" : "nights"}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-medium mb-2">Room Details</h4>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Room type:</span>
										<span>{hotel.rooms[roomId].type}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Guests:</span>
										<span>
											{adults} {adults === 1 ? "adult" : "adults"}
											{children > 0
												? `, ${children} ${
														children === 1 ? "child" : "children"
												  }`
												: ""}
										</span>
									</div>
								</div>
							</div>

							<Separator />

							<div>
								<h4 className="font-medium mb-2">Price Details</h4>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Room rate ({nights} {nights === 1 ? "night" : "nights"}):
										</span>
										<span>${(price - tax).toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Taxes & fees ({hotel.pricing.taxRate * 100}%):
										</span>
										<span>${tax.toFixed(2)}</span>
									</div>
									<Separator className="my-1" />
									<div className="flex justify-between font-medium">
										<span>Total:</span>
										<span>${price.toFixed(2)}</span>
									</div>
								</div>
							</div>

							<div className="bg-muted p-3 rounded-md text-sm">
								<h4 className="font-medium mb-1">Cancellation Policy</h4>
								<p>
									{hotel.policies.cancellation.freeCancellation
										? `Free cancellation until ${format(
												new Date(checkIn),
												"MMM d, yyyy"
										  )} (${
												hotel.policies.cancellation.daysBeforeCheckIn
										  } days before check-in).`
										: `Cancellation will incur a penalty fee of $${hotel.policies.cancellation.penaltyFee}.`}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
