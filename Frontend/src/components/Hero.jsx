import { useEffect } from "react";
import { Input } from "@/components/ui/search-bar";
import { useSearchHotelsQuery } from "@/lib/api";
import { setSearchQuery, setSearchResults } from "@/lib/features/searchSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Hero() {
	const dispatch = useDispatch();
	const searchQuery = useSelector((state) => state.search.searchQuery);

	const handleSearch = (e) => {
		e.preventDefault();
		window.location.href = "#";
		const query = e.target.elements.search.value.trim();

		if (query && query !== searchQuery) {
			// Only dispatch if the query is new or different
			dispatch(setSearchQuery(query));

			const hotelListings = document.getElementById("hotel-listings");
			if (hotelListings) {
				const elementPosition =
					hotelListings.getBoundingClientRect().top + window.scrollY;
				window.scrollTo({
					top: elementPosition - 72,
					behavior: "smooth",
				});
			}
		}
	};

	// Fetch search results based on the query in Redux
	const { data: searchResults, isFetching } = useSearchHotelsQuery(
		searchQuery,
		{
			skip: !searchQuery, // Skip if no query
		}
	);

	// Update search results in Redux when data is fetched
	useEffect(() => {
		if (searchResults && !isFetching) {
			dispatch(setSearchResults(searchResults));
		}
	}, [searchResults, isFetching, dispatch]);

	return (
		<div className="container mx-auto px-8 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-12">
			{/* Left column */}
			<div className="relative z-10 flex flex-col text-white justify-center col-span-2 pt-24 lg:pt-0">
				<h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold mb-8 !leading-[1.2]">
					Find the Perfect Hotel
					<br />
					with AI-Powered
					<br />
					Recommendations
				</h1>
				<p className="text-md sm:text-lg md:text-xl font-light mb-12 max-w-2xl">
					Welcome to our AI-powered hotel recommendation engine, where our
					cutting-edge algorithms analyze your preferences and past bookings to
					provide you the perfect accommodations.
				</p>
				<form
					onSubmit={handleSearch}
					className="w-full max-w-3xl md:h-16 h-14 rounded-full flex items-center"
				>
					<Input />
				</form>
			</div>
			{/* Right column */}
			<div className="relative z-10 w-full h-fit lg:h-full lg:w-fit flex lg:flex-col text-white text-left justify-between lg:justify-center items-center ml-auto lg:gap-16">
				<div className="w-fit lg:w-full">
					<h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-2 md:mb-4">
						12k+
					</h2>
					<p className="text-md sm:text-lg md:text-xl font-light max-w-2xl">
						Satisfied Visitors
					</p>
				</div>
				<div className="w-fit lg:w-full">
					<h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-2 md:mb-4">
						86k+
					</h2>
					<p className="text-md sm:text-lg md:text-xl font-light max-w-2xl">
						Amazing Reviews
					</p>
				</div>
				<div className="w-fit lg:w-full">
					<h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-2 md:mb-4">
						27k+
					</h2>
					<p className="text-md sm:text-lg md:text-xl font-light max-w-2xl">
						Bookings Made
					</p>
				</div>
			</div>
			<div className="absolute inset-0 w-full h-full object-cover -z-10">
				<img
					src="./assets/hero-bg.jpg"
					alt="Hero Background"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 w-full h-full bg-black/75"></div>
			</div>
		</div>
	);
}
