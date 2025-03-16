import { MapPin, Star } from "lucide-react";
import { Link } from "react-router";
function HotelCard({ hotel }) {
	return (
		<Link
			to={`/hotel/${hotel._id}`}
			key={hotel._id}
			className="block group relative cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
		>
			<div className="relative aspect-[4/3] overflow-hidden rounded-xl">
				<img
					src={hotel.image}
					alt={hotel.name}
					className="object-cover w-full h-full absolute transition-transform group-hover:scale-105"
				/>
			</div>

			<div className="mt-3 space-y-2 p-4">
				<h3 className="font-semibold text-lg">{hotel.name}</h3>
				<div className="flex items-center text-muted-foreground">
					<MapPin className="h-4 w-4 mr-1" />
					<span>{hotel.location}</span>
				</div>
				<div className="flex items-center space-x-1">
					{hotel.rating ? (
						<>
							<Star className="h-4 w-4 fill-primary text-primary" />
							<span className="text-muted-foreground">{hotel.rating}</span>
						</>
					) : null}
					<span className="text-muted-foreground">
						({hotel.reviews?.toLocaleString() || "0"} reviews)
					</span>
				</div>
				<div className="flex items-baseline space-x-2">
					<span className="text-xl font-bold">${hotel.price}</span>
				</div>
			</div>
		</Link>
	);
}

export default HotelCard;
