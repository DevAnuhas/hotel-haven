import { useState } from "react";
import { HotelCard, HotelCardSkeleton } from "./HotelCard";
import { SortingTab } from "@/components/SortingTab";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHotelsQuery } from "@/lib/api";
import { useSelector } from "react-redux";

export default function HotelListings() {
	const {
		data: hotels,
		isLoading: isHotelsLoading,
		error: hotelsError,
	} = useGetHotelsQuery();
	const { searchQuery, searchResults, isFetchingSearch } = useSelector(
		(state) => state.search
	);

	// Use search results if available, otherwise use all hotels
	const hotelsToDisplay = searchResults || hotels;

	// TODO: Add dynamic sorting options based on hotel locations
	const sortingList = [
		{ name: "All", value: "all" },
		{ name: "France", value: "france" },
		{ name: "Australia", value: "australia" },
		{ name: "Japan", value: "japan" },
		{ name: "Italy", value: "italy" },
	];

	const [selectedSorting, setSelectedSorting] = useState("all");

	const handleSelectedSorting = (sorting) => {
		setSelectedSorting(sorting);
	};

	const filteredHotels =
		selectedSorting === "all"
			? hotelsToDisplay
			: hotelsToDisplay.filter((hotel) =>
					hotel.location.country
						.toLowerCase()
						.includes(selectedSorting.toLowerCase())
			  );

	const sortingTab = sortingList.map((sorting) => (
		<SortingTab
			key={sorting.value}
			selectedSorting={selectedSorting}
			sorting={sorting}
			onClick={handleSelectedSorting}
		/>
	));

	return (
		<section
			id="hotel-listings"
			className="container w-full py-6 md:py-12 lg:py-16 mx-auto"
		>
			<div className="mb-6 space-y-3">
				<h3 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					{isFetchingSearch || isHotelsLoading
						? "Your experience is loading..."
						: "Top hotels that matches your vibe"}
				</h3>
				<div className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					{isFetchingSearch || isHotelsLoading ? (
						<Skeleton className="h-5 w-[700px] mt-6" />
					) : searchQuery ? (
						`Search Results for "${searchQuery}"`
					) : (
						"Discover the most trending hotels worldwide for an unforgettable experience."
					)}
				</div>
			</div>
			<div className="flex gap-4 py-4">{sortingTab}</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
				{isFetchingSearch || isHotelsLoading ? (
					Array.from({ length: 8 }, (_, index) => (
						<HotelCardSkeleton key={index} />
					))
				) : (
					<>
						{hotelsError && !searchResults && <p>{hotelsError}</p>}
						{filteredHotels?.map((hotel) => (
							<HotelCard key={hotel._id} hotel={hotel} />
						)) || <p>No hotels found</p>}
					</>
				)}
			</div>
		</section>
	);
}
