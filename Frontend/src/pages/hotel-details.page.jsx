import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetHotelByIdQuery } from "@/lib/api";
import { differenceInDays, addDays } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { GuestSelector } from "@/components/ui/guest-selector";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	StarIcon,
	MapPinIcon,
	PhoneIcon,
	MailIcon,
	GlobeIcon,
	Sandwich,
	Utensils,
	BusFront,
	SquareParking,
	Wifi,
	WavesLadder,
	Beer,
	Dumbbell,
	Dog,
	Leaf,
} from "lucide-react";

export default function HotelDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [dateRange, setDateRange] = useState({
		from: addDays(new Date(), 1),
		to: addDays(new Date(), 4),
	});
	const [adults, setAdults] = useState(2);
	const [children, setChildren] = useState(0);

	if (isLoading)
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Section */}
					<div className="lg:col-span-2">
						<div className="mb-6">
							{/* Hotel Header */}
							<div className="flex flex-wrap items-start justify-between gap-4 mb-4">
								<div>
									<Skeleton className="h-8 w-48 mb-2" />
									<Skeleton className="h-5 w-32 mb-2" />
									<Skeleton className="h-4 w-64" />
								</div>
								<div className="text-right">
									<Skeleton className="h-8 w-16 mb-1" />
									<Skeleton className="h-4 w-32" />
								</div>
							</div>

							{/* Main Image */}
							<Skeleton className="relative aspect-[16/9] w-full rounded-lg mb-4" />

							{/* Gallery */}
							<div className="grid grid-cols-4 gap-2">
								{[...Array(4)].map((_, index) => (
									<Skeleton
										key={index}
										className="relative aspect-square w-full rounded-lg"
									/>
								))}
							</div>
						</div>
					</div>

					{/* Right Section */}
					<div className="lg:col-span-1">
						<Card className="sticky top-8">
							<CardHeader>
								<CardTitle>
									<Skeleton className="h-6 w-32" />
								</CardTitle>
								<CardDescription>
									<Skeleton className="h-4 w-48" />
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{/* Check-in/Check-out */}
									<div>
										<Skeleton className="h-4 w-32 mb-2" />
										<div className="grid grid-cols-2 gap-2">
											<Skeleton className="h-10 w-full rounded-md" />
											<Skeleton className="h-10 w-full rounded-md" />
										</div>
									</div>

									{/* Guests */}
									<div>
										<Skeleton className="h-4 w-32 mb-2" />
										<Skeleton className="h-10 w-full rounded-md" />
									</div>

									<Separator />

									{/* Selected Room */}
									<div>
										<Skeleton className="h-4 w-32 mb-2" />
										<Skeleton className="h-16 w-full rounded-md" />
									</div>

									<Separator />

									{/* Pricing */}
									<div className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-full" />
										<Separator />
										<Skeleton className="h-6 w-full" />
									</div>

									<Skeleton className="h-10 w-full" />

									<Skeleton className="h-4 w-48 mx-auto" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);

	if (isError) {
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Error Loading Hotel</h1>
					<p className="text-muted-foreground">
						{error.status + ": " + error.data.message}
					</p>
				</div>
			</div>
		);
	}

	const nights =
		dateRange?.from && dateRange?.to
			? differenceInDays(dateRange.to, dateRange.from)
			: 0;

	// Calculate total price
	const roomPrice = selectedRoom ? selectedRoom.basePrice * nights : 0;
	const taxAmount = roomPrice * hotel.pricing.taxRate;
	const totalPrice = roomPrice + taxAmount;

	const handleGuestsChange = (newAdults, newChildren) => {
		setAdults(newAdults);
		setChildren(newChildren);
	};

	const handleBookNow = () => {
		if (!selectedRoom || !dateRange?.from || !dateRange?.to) return;

		// Format dates for URL
		const checkIn = dateRange.from.toISOString().split("T")[0];
		const checkOut = dateRange.to.toISOString().split("T")[0];

		// Navigate to booking page
		navigate(
			`/booking?hotelId=${hotel._id}&roomId=${hotel.rooms.indexOf(
				selectedRoom
			)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&price=${totalPrice.toFixed(
				2
			)}&tax=${taxAmount.toFixed(2)}`
		);
	};

	// Generate star rating display
	const stars = Array(hotel.starRating).fill(0);

	return (
		<div className="container mx-auto py-16 mt-12">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="mb-6">
						<div className="flex flex-wrap items-start justify-between gap-4 mb-4">
							<div>
								<h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
								<div className="flex items-center gap-1 mb-2">
									{stars.map((_, i) => (
										<StarIcon
											key={i}
											className="h-5 w-5 fill-yellow-400 text-yellow-400"
										/>
									))}
									<Badge variant="outline" className="ml-2">
										{hotel.category}
									</Badge>
								</div>
								<div className="flex items-center text-muted-foreground">
									<MapPinIcon className="h-4 w-4 mr-1" />
									<span>
										{hotel.location.city}, {hotel.location.country}
									</span>
								</div>
							</div>

							<div className="text-right">
								<div className="flex items-center justify-end gap-2 mb-1">
									<Badge
										variant="secondary"
										className="text-2xl font-bold px-3 py-1"
									>
										{hotel.rating.average.toFixed(1)}
									</Badge>
									<div className="flex flex-col">
										<span className="font-medium">{hotel.rating.category}</span>
										<span className="text-sm text-muted-foreground">
											{hotel.rating.count} reviews
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="relative aspect-[16/9] overflow-hidden flex justify-center rounded-lg mb-4">
							<img
								src={hotel.images.main || "/assets/placeholder.svg"}
								alt={hotel.name}
								className="w-full object-cover"
							/>
						</div>

						<div className="grid grid-cols-4 gap-2">
							{hotel.images.gallery.slice(0, 4).map((image, index) => (
								<div
									key={index}
									className="relative aspect-square overflow-hidden"
								>
									<img
										src={image || "/assets/placeholder.svg"}
										alt={`${hotel.name} gallery ${index + 1}`}
										className="h-full object-cover"
									/>
								</div>
							))}
						</div>
					</div>

					<Tabs defaultValue="overview">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="rooms">Rooms</TabsTrigger>
							<TabsTrigger value="amenities">Amenities</TabsTrigger>
							<TabsTrigger value="reviews">Reviews</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="pt-4">
							<div className="space-y-6">
								<div>
									<h2 className="text-xl font-semibold mb-2">
										About this hotel
									</h2>
									<p className="text-muted-foreground">{hotel.description}</p>
								</div>

								<div>
									<h3 className="text-lg font-semibold mb-2">
										Contact Information
									</h3>
									<div className="space-y-2">
										{hotel.contact.phone && (
											<div className="flex items-center">
												<PhoneIcon className="h-4 w-4 mr-2" />
												<span>{hotel.contact.phone}</span>
											</div>
										)}
										{hotel.contact.email && (
											<div className="flex items-center">
												<MailIcon className="h-4 w-4 mr-2" />
												<span>{hotel.contact.email}</span>
											</div>
										)}
										{hotel.contact.website && (
											<div className="flex items-center">
												<GlobeIcon className="h-4 w-4 mr-2" />
												<a
													href={hotel.contact.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													{hotel.contact.website}
												</a>
											</div>
										)}
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold mb-2">Policies</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="font-medium">Check-in/Check-out</p>
											<p className="text-muted-foreground">
												Check-in: {hotel.policies.checkInTime}
											</p>
											<p className="text-muted-foreground">
												Check-out: {hotel.policies.checkOutTime}
											</p>
										</div>
										<div>
											<p className="font-medium">Cancellation Policy</p>
											<p className="text-muted-foreground">
												{hotel.policies.cancellation.freeCancellation
													? `Free cancellation up to ${hotel.policies.cancellation.daysBeforeCheckIn} days before check-in`
													: `Cancellation penalty: $${hotel.policies.cancellation.penaltyFee}`}
											</p>
										</div>
										<div>
											<p className="font-medium">Pets</p>
											<p className="text-muted-foreground">
												{hotel.policies.petsAllowed
													? "Pets allowed"
													: "No pets allowed"}
											</p>
										</div>
										<div>
											<p className="font-medium">Extra Beds</p>
											<p className="text-muted-foreground">
												{hotel.policies.extraBedPolicy}
											</p>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="rooms" className="pt-4">
							<div className="grid grid-cols-2 gap-8">
								{hotel.rooms.map((room, index) => (
									<Card
										key={index}
										className={
											selectedRoom?.name === room.name ? "border-primary" : ""
										}
									>
										<CardContent className="p-0">
											<div className="p-6 md:col-span-2">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h3 className="text-xl font-bold">{room.name}</h3>
														<p className="text-sm text-muted-foreground">
															{room.type} Room
														</p>
													</div>
													<div className="text-right">
														<p className="text-2xl font-bold">
															${room.basePrice}
														</p>
														<p className="text-xs text-muted-foreground">
															per night
														</p>
													</div>
												</div>

												<div className="grid grid-cols-2 gap-2 mb-4">
													<div className="flex items-center gap-1 text-sm">
														<span className="font-medium">Bed:</span>
														<span>
															{room.bedCount} {room.bedType}
														</span>
													</div>
													<div className="flex items-center gap-1 text-sm">
														<span className="font-medium">Max Guests:</span>
														<span>{room.maxOccupancy}</span>
													</div>
													<div className="flex items-center gap-1 text-sm">
														<span className="font-medium">Size:</span>
														<span>{room.size} m²</span>
													</div>
													<div className="flex items-center gap-1 text-sm">
														<span className="font-medium">Bathroom:</span>
														<span>
															{room.hasBathroom ? "Private" : "Shared"}
														</span>
													</div>
												</div>

												<p className="text-sm text-muted-foreground mb-4">
													{room.description}
												</p>

												<div className="flex justify-end">
													<Button
														onClick={() =>
															setSelectedRoom(
																selectedRoom?.name === room.name ? null : room
															)
														}
														variant={
															selectedRoom?.name === room.name
																? "default"
																: "outline"
														}
													>
														{selectedRoom?.name === room.name
															? "Selected"
															: "Select Room"}
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="amenities" className="pt-4">
							<div>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{hotel.amenities.breakfastIncluded && (
										<div className="flex items-center gap-2">
											<Sandwich className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Breakfast Included</span>
										</div>
									)}
									{hotel.amenities.freeAirportShuttle && (
										<div className="flex items-center gap-2">
											<BusFront className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Airport Shuttle</span>
										</div>
									)}

									{hotel.amenities.freeWifi && (
										<div className="flex items-center gap-2">
											<Wifi className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Free WiFi</span>
										</div>
									)}

									{hotel.amenities.freeParking && (
										<div className="flex items-center gap-2">
											<SquareParking className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Free Parking</span>
										</div>
									)}

									{hotel.amenities.swimmingPool && (
										<div className="flex items-center gap-2">
											<WavesLadder className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Swimming Pool</span>
										</div>
									)}

									{hotel.amenities.petsAllowed && (
										<div className="flex items-center gap-2">
											<Dog className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Pets Allowed</span>
										</div>
									)}

									{hotel.amenities.restaurant && (
										<div className="flex items-center gap-2">
											<Utensils className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Restaurant</span>
										</div>
									)}

									{hotel.amenities.bar && (
										<div className="flex items-center gap-2">
											<Beer className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Bar</span>
										</div>
									)}

									{hotel.amenities.gym && (
										<div className="flex items-center gap-2">
											<Dumbbell className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Gym</span>
										</div>
									)}

									{hotel.amenities.spa && (
										<div className="flex items-center gap-2">
											<Leaf className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-muted" />
											<span>Spa</span>
										</div>
									)}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="reviews" className="pt-4">
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h3 className="text-lg font-semibold mb-4">
											Rating Breakdown
										</h3>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span>Cleanliness</span>
												<div className="flex items-center">
													<span className="font-medium mr-2">
														{hotel.rating.breakdown.cleanliness.toFixed(1)}
													</span>
													<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{
																width: `${
																	(hotel.rating.breakdown.cleanliness / 10) *
																	100
																}%`,
															}}
														/>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Comfort</span>
												<div className="flex items-center">
													<span className="font-medium mr-2">
														{hotel.rating.breakdown.comfort.toFixed(1)}
													</span>
													<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{
																width: `${
																	(hotel.rating.breakdown.comfort / 10) * 100
																}%`,
															}}
														/>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Location</span>
												<div className="flex items-center">
													<span className="font-medium mr-2">
														{hotel.rating.breakdown.location.toFixed(1)}
													</span>
													<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{
																width: `${
																	(hotel.rating.breakdown.location / 10) * 100
																}%`,
															}}
														/>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Facilities</span>
												<div className="flex items-center">
													<span className="font-medium mr-2">
														{hotel.rating.breakdown.facilities.toFixed(1)}
													</span>
													<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{
																width: `${
																	(hotel.rating.breakdown.facilities / 10) * 100
																}%`,
															}}
														/>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Staff</span>
												<div className="flex items-center">
													<span className="font-medium mr-2">
														{hotel.rating.breakdown.staff.toFixed(1)}
													</span>
													<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{
																width: `${
																	(hotel.rating.breakdown.staff / 10) * 100
																}%`,
															}}
														/>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Value for Money</span>
												<div className="flex items-center">
													<span className="font-medium mr-2">
														{hotel.rating.breakdown.valueForMoney.toFixed(1)}
													</span>
													<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary"
															style={{
																width: `${
																	(hotel.rating.breakdown.valueForMoney / 10) *
																	100
																}%`,
															}}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-lg font-semibold mb-4">
											Guest Reviews
										</h3>
										<div className="space-y-4">
											{hotel.reviews.length > 0 ? (
												hotel.reviews.map((review, index) => (
													<div key={index} className="border rounded-lg p-4">
														<div className="flex justify-between items-start mb-2">
															<div>
																<h4 className="font-medium">
																	{review.title || "Review"}
																</h4>
																<p className="text-sm text-muted-foreground">
																	{new Date(review.date).toLocaleDateString()}
																</p>
															</div>
															<Badge variant="secondary">
																{review.rating.toFixed(1)}
															</Badge>
														</div>
														<p className="text-sm">{review.comment}</p>
														{review.verified && (
															<Badge variant="outline" className="mt-2">
																Verified Stay
															</Badge>
														)}
													</div>
												))
											) : (
												<p className="text-muted-foreground">No reviews yet.</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				<div className="lg:col-span-1">
					<Card className="sticky top-28">
						<CardHeader>
							<CardTitle>Book Your Stay</CardTitle>
							<CardDescription>Select dates and room to book</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium mb-1">
										Check-in / Check-out
									</h3>
									<DateRangePicker
										dateRange={dateRange}
										onDateRangeChange={setDateRange}
									/>
								</div>

								<div>
									<h3 className="text-sm font-medium mb-1">Guests</h3>
									<GuestSelector
										adults={adults}
										// eslint-disable-next-line react/no-children-prop
										children={children}
										onGuestsChange={handleGuestsChange}
										maxOccupancy={selectedRoom?.maxOccupancy}
									/>
								</div>

								<Separator />

								<div>
									<h3 className="text-sm font-medium mb-2">Selected Room</h3>
									{selectedRoom ? (
										<div className="border rounded-md p-3">
											<div className="flex justify-between items-start">
												<div>
													<p className="font-medium">{selectedRoom.name}</p>
													<p className="text-xs text-muted-foreground">
														{selectedRoom.type} Room
													</p>
												</div>
												<p className="font-bold">${selectedRoom.basePrice}</p>
											</div>
										</div>
									) : (
										<p className="text-sm text-muted-foreground">
											Please select a room from the Rooms tab
										</p>
									)}
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between">
										<span>
											Room price ({nights} {nights === 1 ? "night" : "nights"})
										</span>
										<span className="font-medium">${roomPrice.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Taxes & fees ({hotel.pricing.taxRate * 100}%)</span>
										<span className="font-medium">${taxAmount.toFixed(2)}</span>
									</div>
									<Separator />
									<div className="flex justify-between font-bold">
										<span>Total</span>
										<span>${totalPrice.toFixed(2)}</span>
									</div>
								</div>

								<Button
									className="w-full"
									size="lg"
									disabled={
										!selectedRoom ||
										!dateRange?.from ||
										!dateRange?.to ||
										nights === 0
									}
									onClick={handleBookNow}
								>
									Book Now
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
