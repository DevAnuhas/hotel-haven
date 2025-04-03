import { useState } from "react";
import { HotelCard, HotelCardSkeleton } from "./HotelCard";
import { SortingTab } from "@/components/SortingTab";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHotelFilterOptionsQuery, useGetHotelsQuery } from "@/lib/api";
import { useSelector } from "react-redux";

export default function HotelListings() {
	const { searchQuery, searchResults, isFetchingSearch } = useSelector(
		(state) => state.search
	);

	const [selectedCountry, setSelectedCountry] = useState("All");
	const [selectedCity, setSelectedCity] = useState("All");

	const filters = {
		country: selectedCountry === "All" ? undefined : selectedCountry,
		city: selectedCity === "All" ? "all" : undefined, // TODO: Handle city selection
	};

	const {
		data: hotelData,
		isLoading,
		isError,
		error,
	} = useGetHotelsQuery(filters);

	const hotels = hotelData?.hotels || [];

	// Use search results if available, otherwise use all hotels
	const hotelsToDisplay = searchResults || hotels;

	// Get unique countries for the filter
	const { data: filterOptions } = useGetHotelFilterOptionsQuery();
	const countries = filterOptions?.countries || [];

	const handleSelectedSorting = (sorting) => {
		setSelectedCountry(sorting);
		setSelectedCity("All"); // TODO: Handle city selection
	};

	const filteredHotels =
		selectedCountry === "All"
			? hotelsToDisplay?.slice(0, 6)
			: hotelsToDisplay?.filter((hotel) =>
					hotel.location.country
						.toLowerCase()
						.includes(selectedCountry?.toLowerCase())
			  );

	const sortingTab = ["All", ...countries].map((country) => (
		<SortingTab
			key={country}
			selectedSorting={selectedCountry}
			sorting={country}
			onClick={handleSelectedSorting}
		/>
	));

	if (isError) {
		console.log(error);
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Error Loading Hotels</h1>
					<p className="text-muted-foreground">
						{error.status + ": " + error.data.message}
					</p>
				</div>
			</div>
		);
	}

	return (
		<section
			id="hotel-listings"
			className="container w-full py-6 md:py-12 lg:py-16 mx-auto"
		>
			<div className="mb-6 space-y-3">
				<h3 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					{isFetchingSearch || isLoading
						? "Your experience is loading..."
						: "Top hotels that matches your vibe"}
				</h3>
				<div className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					{isFetchingSearch || isLoading ? (
						<Skeleton className="h-5 w-[700px] mt-6" />
					) : searchQuery ? (
						`AI-Powered Hotel Recommendations for "${searchQuery}"`
					) : (
						"Discover the most trending hotels worldwide for an unforgettable experience."
					)}
				</div>
			</div>
			<div className="flex gap-4 py-4">{sortingTab}</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
				{isFetchingSearch || isLoading ? (
					Array.from({ length: 6 }, (_, index) => (
						<HotelCardSkeleton key={index} />
					))
				) : (
					<>
						{isError && !searchResults && <p>{isError}</p>}
						{filteredHotels?.map((hotel) => (
							<HotelCard key={hotel._id} hotel={hotel} />
						)) || <p>No hotels found</p>}
					</>
				)}
			</div>
		</section>
	);
}
