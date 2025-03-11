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
		const query = e.target.elements.search.value.trim();
		// Only dispatch if the query is new or different
		if (query && query !== searchQuery) {
			dispatch(setSearchQuery(query));
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
		<div className="relative min-h-screen">
			<div className="relative z-10 flex flex-col items-center text-white justify-center px-8 pt-48 pb-32">
				<h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
					Find Your Perfect Stay with AI
				</h1>
				<p className="text-xl font-medium mb-12 text-center max-w-2xl">
					Describe your dream destination and experience, and
					<br />
					we&apos;ll find the perfect place for you.
				</p>

				<form
					onSubmit={handleSearch}
					className="w-full max-w-3xl md:h-16 h-14 rounded-full flex items-center"
				>
					<Input name="search" placeholder="Search for hotels..." />
				</form>
			</div>
			<div className="absolute top-0 left-0 w-full h-full object-cover -z-10">
				<img
					src="./assets/hero-bg.jpg"
					alt="Hero Background"
					className="w-full h-full object-cover"
				/>
				<div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
			</div>
		</div>
	);
}
