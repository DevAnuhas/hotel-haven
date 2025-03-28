import { MapPin, Star } from "lucide-react";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

export function HotelCard({ hotel }) {
	const lowestPrice = Math.min(...hotel.rooms.map((room) => room.basePrice));
	return (
		<Link
			to={`/hotel/${hotel._id}`}
			key={hotel._id}
			className="block group relative cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
		>
			<div className="relative aspect-[4/3] overflow-hidden rounded-xl">
				<img
					src={hotel.images.main}
					alt={hotel.name}
					className="object-cover w-full h-full absolute transition-transform group-hover:scale-105"
				/>
			</div>

			<div className="mt-3 space-y-2 p-4">
				<h3 className="font-semibold text-lg">{hotel.name}</h3>
				<div className="flex items-center text-muted-foreground">
					<MapPin className="h-4 w-4 mr-1" />
					<span>
						{hotel.location.city}, {hotel.location.country}
					</span>
				</div>
				<div className="flex items-center space-x-1">
					<Star className="h-4 w-4 fill-primary text-primary" />
					<span className="text-muted-foreground">
						{hotel.rating.average}/10
					</span>
					<span className="text-muted-foreground">
						({hotel.reviews.length} reviews)
					</span>
				</div>
				<div className="flex items-baseline space-x-2">
					<span className="text-xl font-bold">From ${lowestPrice}</span>
				</div>
			</div>
		</Link>
	);
}

export function HotelCardSkeleton() {
	return (
		<div>
			<div className="relative aspect-[4/3] overflow-hidden rounded-xl">
				<Skeleton className="absolute inset-0" />
			</div>

			<div className="mt-3 space-y-2 p-4">
				<Skeleton className="h-7 w-3/4" />

				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>

				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-8" />
					<Skeleton className="h-4 w-24" />
				</div>

				<div className="flex items-baseline">
					<Skeleton className="h-7 w-20" />
				</div>
			</div>
		</div>
	);
}
