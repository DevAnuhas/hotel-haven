import { useState } from "react";
import { useLocation, Link } from "react-router";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetHotelByIdQuery } from "@/lib/api";
import { StarIcon, ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";

export default function BookingPage() {
	const { search } = useLocation();
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

	const {
		data: hotel,
		isLoading,
		isError,
		error,
	} = useGetHotelByIdQuery(hotelId);

	// Form state
	const [firstName, setFirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);
	const [email, setEmail] = useState(user?.emailAddresses);
	const [phone, setPhone] = useState(user?.primaryPhoneNumber);
	const [specialRequests, setSpecialRequests] = useState("");

	// Payment state
	const [cardNumber, setCardNumber] = useState("");
	const [cardName, setCardName] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [cvv, setCvv] = useState("");

	// Booking process state
	const [isProcessing, setIsProcessing] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

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

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			setIsProcessing(false);
			setIsComplete(true);
		}, 2000);
	};

	// Generate star rating display
	const stars = hotel && Array(hotel.starRating).fill(0);

	// If booking is complete, show success message
	if (isComplete) {
		return (
			<div className="container mx-auto max-w-4xl py-10">
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
							<span className="font-medium">
								BK{Math.floor(Math.random() * 1000000)}
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col md:flex-row gap-4 items-start">
							<div className="relative h-24 w-32 rounded-md overflow-hidden">
								<img
									src={hotel.images.main || "/placeholder.svg"}
									alt={hotel.name}
									className="object-cover"
								/>
							</div>
							<div>
								<h3 className="font-bold">{hotel.name}</h3>
								<div className="flex items-center gap-1 mb-1">
									{stars.map((_, i) => (
										<StarIcon
											key={i}
											className="h-4 w-4 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<p className="text-sm text-muted-foreground">
									{hotel.location.city}, {hotel.location.country}
								</p>
							</div>
						</div>

						<Separator />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h4 className="font-medium mb-2">Stay Information</h4>
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
										<span className="text-muted-foreground">Room:</span>
										<span>{hotel.rooms[roomId].name}</span>
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

							<div>
								<h4 className="font-medium mb-2">Payment Summary</h4>
								<div className="space-y-1 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Room rate ({nights} {nights === 1 ? "night" : "nights"}):
										</span>
										<span>${(price - tax).toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Taxes & fees:</span>
										<span>${tax.toFixed(2)}</span>
									</div>
									<Separator className="my-1" />
									<div className="flex justify-between font-medium">
										<span>Total paid:</span>
										<span>${price.toFixed(2)}</span>
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
		);
	}

	return (
		<div className="container mx-auto max-w-6xl py-8">
			<div className="flex items-center mb-6">
				<Button variant="ghost" size="sm" asChild className="mr-2">
					<Link to={`/hotels/${hotelId}`}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">Complete Your Booking</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<form onSubmit={handleSubmit}>
						<Card className="mb-6">
							<CardHeader>
								<CardTitle>Guest Information</CardTitle>
								<CardDescription>
									Please enter the guest details for this booking
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											required
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="specialRequests">
										Special Requests (optional)
									</Label>
									<Textarea
										id="specialRequests"
										placeholder="Let us know if you have any special requests or requirements"
										value={specialRequests}
										onChange={(e) => setSpecialRequests(e.target.value)}
										className="min-h-[100px]"
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Payment Information</CardTitle>
								<CardDescription>
									Enter your payment details to complete the booking
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="cardNumber">Card Number</Label>
									<div className="relative">
										<Input
											id="cardNumber"
											placeholder="1234 5678 9012 3456"
											value={cardNumber}
											onChange={(e) => setCardNumber(e.target.value)}
											required
										/>
										<CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="cardName">Name on Card</Label>
									<Input
										id="cardName"
										placeholder="John Doe"
										value={cardName}
										onChange={(e) => setCardName(e.target.value)}
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="expiryDate">Expiry Date</Label>
										<Input
											id="expiryDate"
											placeholder="MM/YY"
											value={expiryDate}
											onChange={(e) => setExpiryDate(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="cvv">CVV</Label>
										<Input
											id="cvv"
											placeholder="123"
											value={cvv}
											onChange={(e) => setCvv(e.target.value)}
											required
										/>
									</div>
								</div>
							</CardContent>
							<CardFooter>
								<Button
									type="submit"
									className="w-full"
									disabled={isProcessing}
								>
									{isProcessing
										? "Processing Payment..."
										: `Pay $${price.toFixed(2)}`}
								</Button>
							</CardFooter>
						</Card>
					</form>
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
