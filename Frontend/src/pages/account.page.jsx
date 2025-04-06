import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@clerk/clerk-react";
import {
	useGetBookingsForUserQuery,
	useCancelBookingMutation,
	useArchiveBookingMutation,
	useCreateReviewMutation,
} from "@/lib/api";
import { cancelBookingUtil, archiveBookingUtil } from "@/utils/bookingUtils";
import BookingCard from "@/components/BookingCard";
import CancelBookingDialog from "@/components/CancelBookingDialog";
import ReviewDialog from "@/components/ReviewDialog";
import BeatLoader from "react-spinners/BeatLoader";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AccountPage = () => {
	const { user, isLoaded } = useUser();
	const [userId, setUserId] = useState(null);
	const [bookings, setBookings] = useState([]);
	const [selectedTab, setSelectedTab] = useState("all");
	const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState(null);
	const [rating, setRating] = useState(10);
	const [reviewTitle, setReviewTitle] = useState("");
	const [reviewComment, setReviewComment] = useState("");
	const [cancellationReason, setCancellationReason] = useState("");

	useEffect(() => {
		if (isLoaded) setUserId(user.id);
	}, [isLoaded, user]);

	const { data: bookingData, isLoading } = useGetBookingsForUserQuery(userId, {
		skip: !userId,
	});
	const [cancelBooking] = useCancelBookingMutation();
	const [archiveBooking] = useArchiveBookingMutation();
	const [createReview] = useCreateReviewMutation();

	useEffect(() => {
		if (bookingData) setBookings(bookingData);
	}, [bookingData]);

	const filteredBookings =
		selectedTab === "all"
			? bookings
			: bookings.filter(
					(booking) =>
						booking.status.toLowerCase() === selectedTab.toLowerCase()
			  );
	const selectedBooking = selectedBookingId
		? bookings.find((b) => b._id === selectedBookingId)
		: null;

	const handleCancelBooking = async () => {
		if (!selectedBookingId) return;
		await cancelBookingUtil(
			cancelBooking,
			selectedBookingId,
			cancellationReason
		);
		setIsCancelDialogOpen(false);
		setCancellationReason("");
	};

	const handleArchiveBooking = async (bookingId) => {
		await archiveBookingUtil(archiveBooking, bookingId);
	};

	const handleSubmitReview = async () => {
		try {
			await createReview({
				hotelId: selectedBooking?.hotel?._id,
				bookingId: selectedBookingId,
				rating,
				title: reviewTitle,
				comment: reviewComment,
			}).unwrap();
			toast.success("Review submitted successfully!");
			setIsReviewDialogOpen(false);
			setReviewComment("");
			setReviewTitle("");
		} catch {
			toast.error("Unable to submit review");
		}
	};

	return (
		<div className="container px-8 w-full py-16 mt-12 mx-auto">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold">My Account</h1>
					<p className="text-muted-foreground">
						{user?.firstName && `Welcome back, ${user?.firstName}`}
					</p>
				</div>
				<Button asChild>
					<Link to="/hotels">Book New Stay</Link>
				</Button>
			</div>

			<Tabs defaultValue="bookings" className="space-y-4">
				<TabsList>
					<TabsTrigger value="bookings">My Bookings</TabsTrigger>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="preferences">Preferences</TabsTrigger>
				</TabsList>

				<TabsContent value="bookings" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>My Bookings</CardTitle>
							<CardDescription>
								View and manage your hotel bookings
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs
								defaultValue="all"
								value={selectedTab}
								onValueChange={setSelectedTab}
								className="space-y-4"
							>
								<TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[600px] h-fit rounded-[1rem] md:rounded-full">
									<TabsTrigger value="all">All</TabsTrigger>
									<TabsTrigger value="pending">Pending</TabsTrigger>
									<TabsTrigger value="confirmed">Confirmed</TabsTrigger>
									<TabsTrigger value="completed">Completed</TabsTrigger>
									<TabsTrigger value="cancelled">Cancelled</TabsTrigger>
									<TabsTrigger value="archived">Archived</TabsTrigger>
								</TabsList>
								<TabsContent value={selectedTab} className="space-y-4">
									{filteredBookings?.length > 0 ? (
										filteredBookings.map((booking) => (
											<BookingCard
												key={booking._id}
												booking={booking}
												onCancel={(id) => {
													setSelectedBookingId(id);
													setIsCancelDialogOpen(true);
												}}
												onArchive={handleArchiveBooking}
												onReview={(id) => {
													setSelectedBookingId(id);
													setIsReviewDialogOpen(true);
												}}
											/>
										))
									) : (
										<div className="text-center py-12">
											{isLoading || !isLoaded ? (
												<BeatLoader loading size={20} />
											) : (
												<>
													<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
													<h3 className="text-lg font-medium mb-2">
														No bookings found
													</h3>
													{selectedTab === "all" ? (
														<>
															<p className="text-muted-foreground mb-4">
																You don&apos;t have any bookings yet.
															</p>
															<Button asChild>
																<Link href="/">Book Your First Stay</Link>
															</Button>
														</>
													) : (
														<p className="text-muted-foreground mb-4">
															You don&apos;t have any {selectedTab} bookings.
														</p>
													)}
												</>
											)}
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="profile">
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>
								View and update your personal information
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											value={user?.firstName}
											className="mt-1"
										/>
									</div>
									<div>
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											value={user?.lastName}
											className="mt-1"
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={user?.primaryEmailAddress}
											className="mt-1"
											disabled
										/>
									</div>
									<div>
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											value={user?.primaryPhoneNumber}
											className="mt-1"
										/>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="preferences">
					<Card>
						<CardHeader>
							<CardTitle>Travel Preferences</CardTitle>
							<CardDescription>
								Set your travel preferences to get personalized recommendations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-medium mb-2">
										Preferred Room Type
									</h3>
									<RadioGroup defaultValue="standard">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="standard" id="standard" />
											<Label htmlFor="standard">Standard</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="comfort" id="comfort" />
											<Label htmlFor="comfort">Comfort</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="premium" id="premium" />
											<Label htmlFor="premium">Premium</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="deluxe" id="deluxe" />
											<Label htmlFor="deluxe">Deluxe</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="suite" id="suite" />
											<Label htmlFor="suite">Suite</Label>
										</div>
									</RadioGroup>
								</div>

								<div>
									<h3 className="text-lg font-medium mb-2">
										Must-Have Amenities
									</h3>
									<div className="grid grid-cols-2 gap-2">
										<div className="flex items-center space-x-2">
											<Checkbox id="wifi" />
											<label
												htmlFor="wifi"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Free WiFi
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="breakfast" />
											<label
												htmlFor="breakfast"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Breakfast Included
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="pool" />
											<label
												htmlFor="pool"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Swimming Pool
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="parking" />
											<label
												htmlFor="parking"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Free Parking
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="gym" />
											<label
												htmlFor="gym"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Gym
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="spa" />
											<label
												htmlFor="spa"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Spa
											</label>
										</div>
									</div>
								</div>

								<div>
									<h3 className="text-lg font-medium mb-2">Price Range</h3>
									<RadioGroup defaultValue="mid">
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="budget" id="budget" />
											<Label htmlFor="budget">Budget ($)</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="mid" id="mid" />
											<Label htmlFor="mid">Mid-range ($$)</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="luxury" id="luxury" />
											<Label htmlFor="luxury">Luxury ($$$)</Label>
										</div>
									</RadioGroup>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Preferences</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>

			<CancelBookingDialog
				isOpen={isCancelDialogOpen}
				onOpenChange={setIsCancelDialogOpen}
				selectedBooking={selectedBooking}
				cancellationReason={cancellationReason}
				setCancellationReason={setCancellationReason}
				onCancel={handleCancelBooking}
			/>

			<ReviewDialog
				isOpen={isReviewDialogOpen}
				onOpenChange={setIsReviewDialogOpen}
				selectedBooking={selectedBooking}
				rating={rating}
				setRating={setRating}
				reviewTitle={reviewTitle}
				setReviewTitle={setReviewTitle}
				reviewComment={reviewComment}
				setReviewComment={setReviewComment}
				onSubmit={handleSubmitReview}
			/>
		</div>
	);
};

export default AccountPage;
