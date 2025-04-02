import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	StarIcon,
	MapPinIcon,
	WifiIcon,
	UtensilsIcon,
	DumbbellIcon,
	WavesLadder,
} from "lucide-react";

export function HotelCard({ hotel }) {
	// Calculate lowest room price
	const lowestPrice = Math.min(...hotel.rooms.map((room) => room.basePrice));

	// Generate star rating display
	const stars = Array(hotel.starRating).fill(0);

	// Get feature icons
	const getFeatureIcons = () => {
		const icons = [];

		if (hotel.amenities.freeWifi) {
			icons.push(<WifiIcon key="wifi" className="h-4 w-4" />);
		}

		if (hotel.amenities.restaurant) {
			icons.push(<UtensilsIcon key="restaurant" className="h-4 w-4" />);
		}

		if (hotel.amenities.gym) {
			icons.push(<DumbbellIcon key="gym" className="h-4 w-4" />);
		}

		if (hotel.amenities.swimmingPool) {
			icons.push(<WavesLadder key="pool" className="h-4 w-4" />);
		}

		return icons;
	};

	return (
		<Card className="overflow-hidden">
			<CardContent className="@container p-0">
				<div className="grid @md:grid-cols-3 gap-4">
					<div className="relative aspect-[16/9] overflow-hidden flex justify-center w-full h-full">
						<img
							src={hotel.images.main || "/assets/placeholder.svg"}
							alt={hotel.name}
							className="object-cover w-full h-full"
						/>
						{hotel.matchScore && (
							<Badge className="absolute left-4 top-4">
								Match Score: {hotel.matchScore.toFixed(2) * 100}%
							</Badge>
						)}
					</div>
					<div className="p-6 @md:col-span-2">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
								<div className="flex items-center gap-1 mb-2">
									{stars.map((_, i) => (
										<StarIcon
											key={i}
											className="h-4 w-4 fill-yellow-400 text-yellow-400"
										/>
									))}
									<Badge variant="outline" className="ml-2">
										{hotel.category}
									</Badge>
								</div>
								<div className="flex items-center text-muted-foreground mb-4">
									<MapPinIcon className="h-4 w-4 mr-1" />
									<span>
										{hotel.location.city}, {hotel.location.country}
									</span>
								</div>
							</div>

							<div className="text-right">
								<div className="flex items-center justify-end gap-1 mb-1">
									<Badge variant="secondary" className="text-lg font-bold">
										{hotel.rating.average}
									</Badge>
									<span className="text-sm font-medium">
										{hotel.rating.category}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									{hotel.rating.count} reviews
								</p>
							</div>
						</div>

						<p className="line-clamp-2 mb-4 text-muted-foreground">
							{hotel.description}
						</p>

						<div className="flex flex-wrap gap-2 mb-4">
							{getFeatureIcons().map((icon, i) => (
								<div
									key={i}
									className="flex items-center justify-center w-8 h-8 rounded-full bg-muted"
								>
									{icon}
								</div>
							))}
						</div>

						<div className="flex justify-between items-end mt-auto">
							<div>
								<p className="text-sm text-muted-foreground">Starting from</p>
								<p className="text-2xl font-bold">${lowestPrice}</p>
								<p className="text-xs text-muted-foreground">per night</p>
							</div>

							<Link to={`/hotel/${hotel._id}`}>
								<Button>View Details</Button>
							</Link>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function HotelCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="grid @md:grid-cols-3 gap-4">
					<div className="relative aspect-[16/9] overflow-hidden flex justify-center w-full h-full">
						<Skeleton className="w-full h-full" />
					</div>
					<div className="p-6 @md:col-span-2">
						<div className="flex justify-between items-start mb-8">
							<div>
								<Skeleton className="h-6 w-48 mb-1" />
								<Skeleton className="h-6 w-28 mb-1" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="text-right">
								<Skeleton className="h-6 w-10 mb-1" />
								<Skeleton className="h-4 w-16" />
							</div>
						</div>
						<Skeleton className="h-4 w-full mb-4" />
						<Skeleton className="h-4 w-5/6 mb-4" />
						<div className="flex flex-wrap gap-2 mb-4">
							{Array(4)
								.fill(0)
								.map((_, i) => (
									<Skeleton key={i} className="w-8 h-8 rounded-full bg-muted" />
								))}
						</div>
						<div className="flex justify-between items-end mt-auto">
							<div>
								<Skeleton className="h-4 w-20 mb-1" />
								<Skeleton className="h-6 w-16 mb-1" />
								<Skeleton className="h-4 w-12" />
							</div>
							<Skeleton className="h-10 w-28" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
