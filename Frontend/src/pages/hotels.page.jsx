import { useState } from "react";
import { useGetHotelsQuery } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HotelCard, HotelCardSkeleton } from "@/components/HotelCard";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function HotelsPage() {
	const { data: hotels, isLoading, isError, error } = useGetHotelsQuery();
	const [searchTerm, setSearchTerm] = useState("");
	const [priceRange, setPriceRange] = useState([0, 1000]);
	const [starRating, setStarRating] = useState(null);
	const [selectedAmenities, setSelectedAmenities] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedCity, setSelectedCity] = useState(null);

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

	// Get unique cities for the filter
	const cities = Array.from(
		new Set(hotels?.map((hotel) => hotel.location.city))
	);

	// TODO: Use semantic search to filter hotels

	// Filter hotels based on search criteria
	const filteredHotels = hotels?.filter((hotel) => {
		// Search term filter (name or description)
		const matchesSearch =
			searchTerm === "" ||
			hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			hotel.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			hotel.location.country.toLowerCase().includes(searchTerm.toLowerCase());

		// Price range filter (using the lowest priced room)
		const lowestPrice = Math.min(...hotel.rooms.map((room) => room.basePrice));
		const matchesPrice =
			lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];

		// Star rating filter
		const matchesStarRating =
			!starRating ||
			starRating === "any" ||
			hotel.starRating.toString() === starRating;

		// City filter
		const matchesCity =
			!selectedCity ||
			selectedCity === "all" ||
			hotel.location.city === selectedCity;

		// Category filter
		const matchesCategory =
			!selectedCategory ||
			selectedCategory === "any" ||
			hotel.category === selectedCategory;

		// Amenities filter
		const matchesAmenities =
			selectedAmenities.length === 0 ||
			selectedAmenities.every((selectedAmenity) => {
				return hotel.amenities[selectedAmenity];
			});

		return (
			matchesSearch &&
			matchesPrice &&
			matchesStarRating &&
			matchesCity &&
			matchesCategory &&
			matchesAmenities
		);
	});

	// Common amenities for filtering
	const amenityDisplayNames = {
		freeWifi: "Free Wi-Fi",
		freeParking: "Free Parking",
		swimmingPool: "Swimming Pool",
		gym: "Gym",
		spa: "Spa",
		restaurant: "Restaurant",
		breakfastIncluded: "Breakfast Included",
		bar: "Bar",
	};
	const commonAmenities = Object.keys(amenityDisplayNames);

	return (
		<div className="container mx-auto px-4 py-16 mt-16 min-h-screen grid grid-cols-1 md:grid-cols-4 gap-6">
			<Card className="md:col-span-1 h-fit">
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium mb-2">Search</h3>
							<Input
								placeholder="Search hotels, cities..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Location</h3>
							<Select
								value={selectedCity || ""}
								onValueChange={setSelectedCity}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select city" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Cities</SelectItem>
									{cities.map((city) => (
										<SelectItem key={city} value={city}>
											{city}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Price Range</h3>
							<div className="px-2">
								<Slider
									defaultValue={[0, 1000]}
									max={1000}
									step={50}
									value={priceRange}
									onValueChange={setPriceRange}
								/>
								<div className="flex justify-between mt-2 text-sm text-muted-foreground">
									<span>${priceRange[0]}</span>
									<span>${priceRange[1]}</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Star Rating</h3>
							<Select value={starRating || ""} onValueChange={setStarRating}>
								<SelectTrigger>
									<SelectValue placeholder="Any rating" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any rating</SelectItem>
									<SelectItem value="1">1 Star</SelectItem>
									<SelectItem value="2">2 Stars</SelectItem>
									<SelectItem value="3">3 Stars</SelectItem>
									<SelectItem value="4">4 Stars</SelectItem>
									<SelectItem value="5">5 Stars</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Hotel Category</h3>
							<Select
								value={selectedCategory || ""}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger>
									<SelectValue placeholder="Any category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="any">Any category</SelectItem>
									<SelectItem value="Budget">Budget</SelectItem>
									<SelectItem value="Economy">Economy</SelectItem>
									<SelectItem value="Midscale">Midscale</SelectItem>
									<SelectItem value="Upscale">Upscale</SelectItem>
									<SelectItem value="Luxury">Luxury</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<h3 className="text-lg font-medium mb-2">Amenities</h3>
							<div className="space-y-2">
								{commonAmenities.map((amenity) => (
									<div key={amenity} className="flex items-center space-x-2">
										<Checkbox
											id={`amenity-${amenity}`}
											checked={selectedAmenities.includes(amenity)}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedAmenities([...selectedAmenities, amenity]);
												} else {
													setSelectedAmenities(
														selectedAmenities.filter((a) => a !== amenity)
													);
												}
											}}
										/>
										<Label htmlFor={`amenity-${amenity}`}>
											{amenityDisplayNames[amenity]}
										</Label>
									</div>
								))}
							</div>
						</div>

						<Button
							className="w-full"
							onClick={() => {
								setSearchTerm("");
								setPriceRange([0, 1000]);
								setStarRating(null);
								setSelectedCity(null);
								setSelectedCategory(null);
								setSelectedAmenities([]);
							}}
							variant="outline"
						>
							Reset Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="md:col-span-3">
				<div className="mb-4 flex justify-between items-center">
					<h2 className="text-xl font-semibold">
						{isLoading
							? "Loading..."
							: `${filteredHotels?.length}
						${filteredHotels?.length === 1 ? "hotel" : "hotels"} found`}
					</h2>
					<Select defaultValue="recommended">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recommended">Recommended</SelectItem>
							<SelectItem value="price-low">Price: Low to High</SelectItem>
							<SelectItem value="price-high">Price: High to Low</SelectItem>
							<SelectItem value="rating">Highest Rating</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{isLoading ? (
						Array.from({ length: 6 }, (_, index) => (
							<HotelCardSkeleton key={index} />
						))
					) : filteredHotels.length > 0 ? (
						filteredHotels?.map((hotel) => (
							<HotelCard key={hotel._id} hotel={hotel} />
						))
					) : (
						<div className="col-span-2 col-start-1 text-center py-12 border rounded-lg ">
							<h3 className="text-lg font-medium mb-2">
								{isError ? "Error" : "No hotels found"}
							</h3>
							<p className="text-muted-foreground">
								{isError ? { error } : "Try adjusting your filters"}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default HotelsPage;
