import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useGetBookingsForUserQuery } from "@/lib/api";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { BookingCard, BookingCardSkeleton } from "@/components/BookingCard";
import { SortingTab } from "@/components/SortingTab";

const AccountPage = () => {
	const { user, isLoaded } = useUser();
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		if (isLoaded) {
			setUserId(user?.id);
		}
	}, [isLoaded, user?.id]);

	const {
		data: bookings,
		isLoading,
		isError,
		error,
	} = useGetBookingsForUserQuery(userId, { skip: !userId });

	const sortingList = [
		{ name: "All", value: "all" },
		{ name: "Pending", value: "pending" },
		{ name: "Confirmed", value: "confirmed" },
		{ name: "Completed", value: "completed" },
		{ name: "Cancelled", value: "cancelled" },
		{ name: "Archived", value: "archived" },
	];

	const [selectedSorting, setSelectedSorting] = useState("all");

	const handleSelectedSorting = (sorting) => {
		setSelectedSorting(sorting);
	};

	const filteredBookings =
		selectedSorting === "all"
			? bookings
			: bookings.filter(
					(booking) =>
						booking.status.toLowerCase() === selectedSorting.toLowerCase()
			  );

	const sortingTab = sortingList.map((sorting) => (
		<SortingTab
			key={sorting.value}
			selectedSorting={selectedSorting}
			sorting={sorting}
			onClick={handleSelectedSorting}
		/>
	));

	if (isError)
		return (
			<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Error loading bookings. Please try again.
					</h1>
					<p className="text-muted-foreground">
						{error.status + ": " + error.data.message}
					</p>
				</div>
			</div>
		);

	return (
		<div className="container w-full py-6 md:py-12 lg:py-16 mt-24 mx-auto">
			<div className="mb-6 space-y-3">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					My Bookings
				</h1>
				<div className="flex gap-4 pt-6">{sortingTab}</div>
				<div className="flex *:mt-8 ">
					{!bookings || isLoading ? (
						<BookingCardSkeleton />
					) : bookings.length === 0 ? (
						<div className="bg-white p-8 rounded-lg shadow-md text-center">
							<p className="text-xl mb-4">
								You don&apos;t have any bookings yet.
							</p>
							<Button variant="outline" asChild>
								<Link to="/">Make a Booking</Link>
							</Button>
						</div>
					) : (
						<div className="w-full grid grid-cols-1 gap-10">
							{filteredBookings.map((booking) => (
								<BookingCard key={booking._id} booking={booking} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AccountPage;
