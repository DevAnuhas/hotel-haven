import { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import { getHotels } from "@/lib/api/hotels";

export default function HotelListings() {
	const [hotels, setHotels] = useState([]);

	useEffect(() => {
		const fetchHotels = async () => {
			const hotels = await getHotels();
			setHotels(hotels);
		};
		fetchHotels();
	}, []);

	const locations = ["All", "France", "Australia", "Japan", "Italy"];

	const [selectedLocation, setSelectedLocation] = useState("All");

	const handleSelectedLocation = (location) => {
		setSelectedLocation(location);
	};

	const filteredHotels =
		selectedLocation === "All"
			? hotels
			: hotels.filter((hotel) =>
					hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())
			  );

	const loacationsTab = locations.map((location) => {
		return (
			<LocationTab
				selectedLocation={selectedLocation}
				key={locations.indexOf(location)}
				location={location}
				onClick={handleSelectedLocation}
			/>
		);
	});

	const hotelCards = filteredHotels.map((hotel) => {
		return <HotelCard key={hotel._id} hotel={hotel} />;
	});

	return (
		<section className="container w-full py-6 md:py-12 lg:py-16 mx-auto">
			<div className="mb-6 space-y-3">
				<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					Top trending hotels worldwide
				</h2>

				<p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					Discover the most trending hotels worldwide for an unforgettable
					experience.
				</p>
			</div>
			<div className="flex items-center gap-x-4">{loacationsTab}</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
				{hotelCards}
			</div>
		</section>
	);
}
