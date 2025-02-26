import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Utensils, Tv, Coffee } from "lucide-react";
import { useParams } from "react-router";
import { useGetHotelByIdQuery } from "@/lib/api";

function HotelsPage() {
	const { id } = useParams();
	const { data: hotel, error } = useGetHotelByIdQuery(id);

	if (error || !hotel) {
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div>{error}</div>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-4">
						<div className="relative w-full h-[400px]">
							<img
								src={hotel.image}
								alt={hotel.name}
								className="absolute object-cover rounded-lg"
							/>
						</div>
						<div className="flex space-x-2">
							<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
								Rooftop View
							</div>
							<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
								French Cuisine
							</div>
							<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
								City Center
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
							<Star fill="currentColor" size={20} />
							<span className="font-bold">{hotel.rating}</span>
							<span className="text-muted-foreground">
								({hotel.reviews.toLocaleString()} reviews)
							</span>
						</div>
						<p className="text-muted-foreground">{hotel.description}</p>
						<div className="rounded-xl border bg-card text-card-foreground shadow">
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
						<div className="flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">${hotel.price}</p>
								<p className="text-sm text-muted-foreground">per night</p>
							</div>
							<Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8">
								Book Now
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default HotelsPage;
