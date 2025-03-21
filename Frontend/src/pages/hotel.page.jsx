import { useState } from "react";
import { useParams } from "react-router";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useGetHotelByIdQuery } from "@/lib/api";

import { MapPin, Star, Wifi, Utensils, Tv, Coffee } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingForm } from "@/components/BookingForm";

function HotelsPage() {
	const { id } = useParams();
	const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);
	const { isSignedIn, isLoaded } = useUser();
	const [bookingOpen, setBookingOpen] = useState(false);

	const handleBooking = () => {
		if (isSignedIn && isLoaded) {
			setBookingOpen(true);
		}
		return;
	};

	if (isLoading)
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-4">
						<Skeleton className="w-full aspect-[4/3] rounded-lg" />
						<div className="flex space-x-2">
							<Skeleton className="w-24 h-6 rounded-md" />
							<Skeleton className="w-24 h-6 rounded-md" />
							<Skeleton className="w-24 h-6 rounded-md" />
						</div>
					</div>
					<div className="space-y-6">
						<div className="flex justify-between items-start">
							<div>
								<Skeleton className="w-48 h-8 rounded-md" />
								<div className="flex items-center mt-2">
									<Skeleton className="w-6 h-6 rounded-full mr-1" />
									<Skeleton className="w-32 h-6 rounded-md" />
								</div>
							</div>
							<Skeleton className="w-9 h-9 rounded-md" />
						</div>
						<div className="flex items-center space-x-1">
							<Skeleton className="w-6 h-6 rounded-full" />
							<Skeleton className="w-8 h-6 rounded-md" />
							<Skeleton className="w-24 h-6 rounded-md" />
						</div>
						<Skeleton className="w-full h-48 rounded-md" />
						<div className="rounded-xl border bg-card text-card-foreground shadow">
							<div className="p-4">
								<Skeleton className="w-32 h-8 rounded-md mb-4" />
								<div className="grid grid-cols-2 gap-4">
									<Skeleton className="w-32 h-6 rounded-md" />
									<Skeleton className="w-32 h-6 rounded-md" />
									<Skeleton className="w-32 h-6 rounded-md" />
									<Skeleton className="w-32 h-6 rounded-md" />
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<Skeleton className="w-16 h-8 mb-2 rounded-md" />
								<Skeleton className="w-24 h-6 rounded-md" />
							</div>
							<Skeleton className="w-32 h-10 rounded-md" />
						</div>
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

	return (
		<>
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-4">
						<div className="relative aspect-[4/3] overflow-hidden rounded-lg">
							<img
								src={hotel.image}
								alt={hotel.name}
								className="absolute object-cover rounded-lg"
							/>
						</div>
						<div className="rounded-lg border bg-card text-card-foreground shadow">
							<div className="p-4">
								<h2 className="text-xl font-semibold mb-4">Amenities</h2>
								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center">
										<Wifi className="mr-2" size={20} />
										<span>Free Wi-Fi</span>
									</div>
									<div className="flex items-center">
										<Utensils className="mr-2" size={20} />
										<span>Restaurant</span>
									</div>
									<div className="flex items-center">
										<Tv className="mr-2" size={20} />
										<span>Flat-screen TV</span>
									</div>
									<div className="flex items-center">
										<Coffee className="mr-2" size={20} />
										<span>Coffee maker</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-6">
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-3xl font-bold">{hotel.name}</h1>
								<div className="flex items-center mt-2">
									<MapPin className="text-muted-foreground mr-1" size={20} />
									<p className="text-muted-foreground">{hotel.location}</p>
								</div>
							</div>
							<button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
								<Star />
								<span className="sr-only">Add to favorites</span>
							</button>
						</div>
						<div className="flex items-center space-x-1">
							{hotel.rating ? (
								<>
									<Star fill="currentColor" size={20} />
									<span className="font-bold">{hotel.rating}</span>
								</>
							) : null}
							<span className="text-muted-foreground">
								({hotel.reviews?.toLocaleString() || "0"} reviews)
							</span>
						</div>
						<p className="text-muted-foreground">{hotel.description}</p>

						<aside className=" mt-8 lg:mt-0">
							<div className="bg-white p-6 rounded-lg border bg-card text-card-foreground shadow sticky top-24">
								<h2 className="text-2xl font-semibold text-hotel-dark mb-4">
									From ${hotel.price} per night
								</h2>
								<p className="text-gray-600 mb-6">
									Experience luxury and comfort in our beautifully designed
									rooms.
								</p>

								<Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
									<DialogTrigger asChild>
										<SignInButton mode="modal">
											<Button
												onClick={handleBooking}
												className="w-full py-6 items-center justify-center gap-2 whitespace-nowrap text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8"
											>
												Book Now
											</Button>
										</SignInButton>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-y-auto">
										<DialogHeader>
											<DialogTitle className="text-center text-2xl font-bold text-hotel-dark">
												Book Your Stay
											</DialogTitle>
											<DialogDescription className="text-center text-gray-600">
												Complete the form below to request a reservation
											</DialogDescription>
										</DialogHeader>
										<BookingForm
											hotelId={id}
											onSuccess={() => setBookingOpen(false)}
										/>
									</DialogContent>
								</Dialog>

								<div className="mt-6 text-sm text-gray-500">
									<ul className="list-disc list-inside">
										<li>Free cancellation up to 48 hours before check-in</li>
										<li>Best rate guarantee when booking direct</li>
										<li>Complimentary breakfast for bookings made today</li>
									</ul>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</>
	);
}

export default HotelsPage;
