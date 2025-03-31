import { useState, useEffect } from "react";
import { Link } from "react-router";
import { format, differenceInDays } from "date-fns";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	StarIcon,
	CalendarIcon,
	MapPinIcon,
	CreditCard,
	ChevronRight,
	CheckCircle,
	XCircle,
	ArchiveIcon,
	MessageSquareMore,
	Clock,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import BeatLoader from "react-spinners/BeatLoader";
import { useUser } from "@clerk/clerk-react";
import {
	useGetBookingsForUserQuery,
	useCancelBookingMutation,
	useArchiveBookingMutation,
	useCreateReviewMutation,
} from "@/lib/api";
import { cancelBookingUtil, archiveBookingUtil } from "@/utils/bookingUtils";

const AccountPage = () => {
	const { user, isLoaded } = useUser();
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		if (isLoaded) {
			setUserId(user.id);
		}
	}, [isLoaded, user]);

	const { data: bookingData, isLoading } = useGetBookingsForUserQuery(userId, {
		skip: !userId,
	});

	const [cancelBooking] = useCancelBookingMutation();
	const [archiveBooking] = useArchiveBookingMutation();
	const [createReview] = useCreateReviewMutation();

	useEffect(() => {
		if (bookingData) {
			setBookings(bookingData);
		}
	}, [bookingData]);

	const [bookings, setBookings] = useState();
	const [selectedTab, setSelectedTab] = useState("all");
	const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState(null);
	const [rating, setRating] = useState(10);
	const [reviewTitle, setReviewTitle] = useState("");
	const [reviewComment, setReviewComment] = useState("");
	const [cancellationReason, setCancellationReason] = useState("");

	// Filter bookings based on selected tab
	const filteredBookings =
		selectedTab === "all"
			? bookings
			: bookings.filter(
					(booking) =>
						booking.status.toLowerCase() === selectedTab.toLowerCase()
			  );

	// Get selected booking
	const selectedBooking = selectedBookingId
		? bookings.find((booking) => booking._id === selectedBookingId)
		: null;

	// Function to calculate cancellation details
	function CancellationPolicy({ selectedBooking }) {
		if (!selectedBooking?.hotel?.policies?.cancellation) {
			return <p>Cancellation policy information is unavailable.</p>;
		}

		// Get policy details
		const { freeCancellation, daysBeforeCheckIn, penaltyFee } =
			selectedBooking.hotel.policies.cancellation;

		const checkInDate = new Date(selectedBooking?.checkInDate);
		const currentDate = new Date();

		const daysDifference = differenceInDays(checkInDate, currentDate);

		// Cancellation message
		let cancellationMessage = "";
		if (freeCancellation && daysDifference >= daysBeforeCheckIn) {
			cancellationMessage = `Free cancellation until ${daysBeforeCheckIn} days before check-in.`;
		} else {
			cancellationMessage = `Cancellation will incur a $${penaltyFee} penalty fee.`;
		}

		return <p>{cancellationMessage}</p>;
	}

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

	// Handle review submission
	const handleSubmitReview = async () => {
		console.log(selectedBooking);

		try {
			await createReview({
				hotelId: selectedBooking?.hotel?._id,
				bookingId: selectedBookingId,
				rating: rating,
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

	// Get status icon
	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return <Clock className="h-5 w-5 text-yellow-500" />;
			case "confirmed":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "completed":
				return <CheckCircle className="h-5 w-5 text-blue-500" />;
			case "cancelled":
				return <XCircle className="h-5 w-5 text-red-500" />;
			case "archived":
				return <ArchiveIcon className="h-5 w-5 text-gray-500" />;
		}
	};

	return (
		<div className="container w-full py-16 mt-12 mx-auto">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold">My Account</h1>
					<p className="text-muted-foreground">
						Welcome back, {user?.firstName}
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
								onValueChange={(value) => setSelectedTab(value)}
								className="space-y-4"
							>
								<TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[600px]">
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
											<Card key={booking.id}>
												<CardContent className="p-0">
													<div className="grid grid-cols-1 rounded-lg md:grid-cols-4 gap-4 overflow-hidden">
														<div className="relative h-48 md:h-full">
															<img
																src={
																	booking.hotel?.image ||
																	"./assets/placeholder.svg"
																}
																alt={booking.hotel?.name || "Hotel"}
																className="object-cover h-full"
															/>
														</div>
														<div className="p-6 md:col-span-3">
															<div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
																<div>
																	<div className="flex items-center gap-2">
																		<h3 className="text-xl font-bold">
																			{booking.hotel?.name}
																		</h3>
																		<div className="flex items-center">
																			{Array(booking.hotel?.starRating || 0)
																				.fill(0)
																				.map((_, i) => (
																					<StarIcon
																						key={i}
																						className="h-4 w-4 fill-yellow-400 text-yellow-400"
																					/>
																				))}
																		</div>
																	</div>
																	<div className="flex items-center text-sm text-muted-foreground mt-1">
																		<MapPinIcon className="h-4 w-4 mr-1" />
																		<span>
																			{booking.hotel?.location.city},{" "}
																			{booking.hotel?.location.country}
																		</span>
																	</div>
																</div>
																<div className="flex items-center gap-2">
																	{getStatusIcon(booking.status)}
																	<div className="text-sm">
																		<p className="font-medium">
																			{booking.status === "pending" &&
																				"Awaiting payment"}
																			{booking.status === "confirmed" &&
																				"Booking confirmed"}
																			{booking.status === "completed" &&
																				"Stay completed"}
																			{booking.status === "cancelled" &&
																				"Booking cancelled"}
																			{booking.status === "archived" &&
																				"Booking archived"}
																		</p>
																		<p className="text-muted-foreground">
																			{booking.refundAmount > 0
																				? `Refunded: $${booking.refundAmount.toFixed(
																						2
																				  )}`
																				: "No refund applied"}
																		</p>
																	</div>
																</div>
															</div>

															<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
																<div className="flex items-center gap-2">
																	<CalendarIcon className="h-4 w-4 text-muted-foreground" />
																	<div className="text-sm">
																		<p className="font-medium">
																			{format(
																				new Date(booking.checkInDate),
																				"EEE, MMM d, yyyy"
																			)}{" "}
																			-{" "}
																			{format(
																				new Date(booking.checkOutDate),
																				"EEE, MMM d, yyyy"
																			)}
																		</p>
																		<p className="text-muted-foreground">
																			{Math.round(
																				(new Date(
																					booking.checkOutDate
																				).getTime() -
																					new Date(
																						booking.checkInDate
																					).getTime()) /
																					(1000 * 60 * 60 * 24)
																			)}{" "}
																			nights, {booking.room?.name}
																		</p>
																	</div>
																</div>
																<div className="text-sm">
																	<p className="font-medium">
																		{booking.adults}{" "}
																		{booking.adults === 1 ? "adult" : "adults"}
																		{booking.children > 0 &&
																			`, ${booking.children} ${
																				booking.children === 1
																					? "child"
																					: "children"
																			}`}
																	</p>
																	<p className="text-muted-foreground">
																		{booking.status === "pending" ||
																		booking.refundAmount === 0
																			? "Payment due:"
																			: "Total paid:"}
																		{""}${booking.price.toFixed(2)}
																	</p>
																</div>
															</div>

															<div className="flex flex-wrap justify-start gap-2">
																{booking.status === "completed" ||
																booking.status === "cancelled" ? (
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleArchiveBooking(booking._id)
																		}
																	>
																		Archive Booking
																	</Button>
																) : (
																	(booking.status === "pending" ||
																		booking.status === "confirmed") && (
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => {
																				setSelectedBookingId(booking._id);
																				setIsCancelDialogOpen(true);
																			}}
																		>
																			Cancel Booking
																		</Button>
																	)
																)}
																{booking.status !== "archived" && (
																	<Button size="sm" asChild>
																		<Link
																			to={`/account/booking-details/${booking._id}`}
																		>
																			View Details
																			<ChevronRight />
																		</Link>
																	</Button>
																)}

																{booking.status === "pending" && (
																	<Button
																		size="sm"
																		onClick={() => {
																			setSelectedBookingId(booking._id);
																			// TODO: Implement payment for pending bookings
																		}}
																		className="ml-auto"
																	>
																		<CreditCard className="mr-1" />
																		Pay Now
																	</Button>
																)}

																{booking.status === "completed" && (
																	<Button
																		size="sm"
																		onClick={() => {
																			setSelectedBookingId(booking._id);
																			setIsReviewDialogOpen(true);
																		}}
																		className="ml-auto"
																		disabled={booking.reviewId}
																	>
																		<MessageSquareMore className="mr-1" />
																		{!booking.reviewId
																			? "Leave Review"
																			: "Review Submitted"}
																	</Button>
																)}
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										))
									) : (
										<div className="text-center py-12">
											{isLoading || !isLoaded ? (
												<>
													<BeatLoader loading size={20} />
												</>
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
											value={user?.email}
											className="mt-1"
										/>
									</div>
									<div>
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											value={user?.phone}
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

			{/* Review Dialog */}
			<Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Leave a Review</DialogTitle>
						<DialogDescription>
							Share your experience at {selectedBooking?.hotel?.name}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="rating">Rating (1-10)</Label>
							<div className="flex items-center gap-4">
								<input
									type="range"
									min="1"
									max="10"
									value={rating}
									onChange={(e) => setRating(Number.parseInt(e.target.value))}
									className="w-full"
								/>
								<span className="font-bold text-lg">{rating}</span>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="title">Review Title</Label>
							<Input
								id="title"
								placeholder="Summarize your experience"
								value={reviewTitle}
								onChange={(e) => setReviewTitle(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="comment">Your Review</Label>
							<Textarea
								id="comment"
								placeholder="Tell us about your stay..."
								className="min-h-[100px]"
								value={reviewComment}
								onChange={(e) => setReviewComment(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsReviewDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleSubmitReview}>Submit Review</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Cancel Booking Dialog */}
			<Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Cancel Booking</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel your booking at{" "}
							{selectedBooking?.hotel?.name}?
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="bg-muted p-3 rounded-md text-sm">
							<h4 className="font-medium mb-1">Cancellation Policy</h4>
							<CancellationPolicy selectedBooking={selectedBooking} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
							<Textarea
								id="reason"
								placeholder="Please let us know why you're cancelling..."
								className="min-h-[100px]"
								value={cancellationReason}
								onChange={(e) => setCancellationReason(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCancelDialogOpen(false)}
						>
							Keep Booking
						</Button>
						<Button variant="destructive" onClick={handleCancelBooking}>
							Cancel Booking
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AccountPage;
