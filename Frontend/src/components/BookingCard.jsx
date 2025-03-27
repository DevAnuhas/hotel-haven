import { format } from "date-fns";
import {
	MapPin,
	EllipsisVertical,
	CalendarOff,
	ChevronRight,
	CalendarArrowDown,
	CalendarArrowUp,
	BedDouble,
	UsersRound,
	NotebookPen,
	Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCancelBookingMutation, useArchiveBookingMutation } from "@/lib/api";

const getStatusColor = (status) => {
	switch (status.toLowerCase()) {
		case "confirmed":
			return "bg-green-100 text-green-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		case "cancelled":
			return "bg-red-100 text-red-800";
		case "completed":
			return "bg-blue-100 text-blue-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export function BookingCard({ booking }) {
	const [cancelBooking] = useCancelBookingMutation();

	const handleCancelBooking = async (bookingId) => {
		const loadingToastId = toast.loading("Cancelling booking...");
		try {
			await cancelBooking(bookingId).unwrap();
			toast.dismiss(loadingToastId);
			toast.success("Booking cancelled successfully!");
		} catch {
			toast.dismiss(loadingToastId);
			toast.error("Unable to cancel booking");
		}
	};

	const [archiveBooking] = useArchiveBookingMutation();

	const handleArchiveBooking = async (bookingId) => {
		const loadingToastId = toast.loading("Archiving booking...");
		try {
			await archiveBooking(bookingId).unwrap();
			toast.dismiss(loadingToastId);
			toast.success("Booking Archived successfully!");
		} catch {
			toast.dismiss(loadingToastId);
			toast.error("Unable to Archive booking");
		}
	};

	const PriceBreakdown = () => (
		<div className="space-y-4 w-full">
			<div className="pb-2">
				<div className="flex justify-between">
					<p className="text-sm text-muted-foreground">Price Per Night</p>
					<p className="font-medium">${booking.pricing.pricePerNight}</p>
				</div>
			</div>
			<Separator />
			<div className="pb-2">
				<div className="flex justify-between">
					<p className="text-sm text-muted-foreground">
						Sub Total x {booking.pricing.nights} nights
					</p>
					<p className="font-medium">${booking.pricing.basePrice}</p>
				</div>
				<div className="flex justify-between">
					<p className="text-sm text-muted-foreground">Tax (10%)</p>
					<p className="font-medium">${booking.pricing.tax}</p>
				</div>
			</div>
			<Separator />
			<div>
				<div className="flex justify-between">
					<p className="text-sm text-muted-foreground">Service Fee</p>
					<p className="font-medium">${booking.pricing.serviceFee}</p>
				</div>
			</div>
			<Separator />
			<div className="flex justify-between pt-2">
				<p className="font-medium">Total</p>
				<p className="text-lg font-bold">${booking.pricing.totalPrice}</p>
			</div>
		</div>
	);

	return (
		<Card className="overflow-hidden">
			<div className="flex flex-col md:flex-row">
				{/* Left side - Image */}
				<CardHeader className="relative md:w-1/3 p-0">
					<img
						src={booking.hotel.image}
						alt={booking.hotel.name}
						className="object-cover w-full h-full"
					/>
					<div className="absolute top-0 left-0 bottom-0 right-0 !mt-0 bg-black opacity-50"></div>
					<Badge
						className={`absolute top-6 right-6 ${getStatusColor(
							booking.status
						)}`}
					>
						{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
					</Badge>
					<div className="text-white absolute bottom-6 left-6">
						<CardTitle className="text-white text-3xl">
							{booking.hotel.name}
						</CardTitle>
						<CardDescription className="flex text-white text-xl items-center mt-2">
							<MapPin className=" mr-2" size={20} />
							{booking.hotel.location}
						</CardDescription>
					</div>
				</CardHeader>

				{/* Right side - Content */}
				<div className="flex-1 flex flex-col justify-between">
					<CardContent className="p-10">
						<div className="bg-card flex flex-row justify-between gap-10">
							{/* Booking details */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-3">
								<div className="space-y-1">
									<div className="flex gap-1 items-center">
										<CalendarArrowDown
											className="text-muted-foreground mr-1"
											size={18}
										/>
										<p className="text-sm text-muted-foreground">Check-in</p>
									</div>
									<p className="font-medium">
										{format(new Date(booking.checkInDate), "MMM d, yyyy")}
									</p>
								</div>
								<div className="space-y-1">
									<div className="flex gap-1 items-center">
										<CalendarArrowUp
											className="text-muted-foreground mr-1"
											size={18}
										/>
										<p className="text-sm text-muted-foreground">Check-out</p>
									</div>
									<p className="font-medium">
										{format(new Date(booking.checkOutDate), "MMM d, yyyy")}
									</p>
								</div>
								<div className="space-y-1">
									<div className="flex gap-1 items-center">
										<BedDouble
											className="text-muted-foreground mr-1"
											size={18}
										/>
										<p className="text-sm text-muted-foreground">Room Type</p>
									</div>
									<p className="font-medium">
										<p className="font-medium capitalize">{booking.roomType}</p>
									</p>
								</div>
								<div className="space-y-1">
									<div className="flex gap-1 items-center">
										<UsersRound
											className="text-muted-foreground mr-1"
											size={18}
										/>
										<p className="text-sm text-muted-foreground">Guests</p>
									</div>
									<p className="font-medium">
										{booking.adults === "1"
											? "1 Adult"
											: `${booking.adults} Adults`}
										{booking.children !== "0"
											? `, ${booking.children} Children`
											: ""}
									</p>
								</div>
							</div>

							<Dialog>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											className="w-8 h-8 p-0 rounded-full"
											disabled={booking.status === "archived"}
										>
											<EllipsisVertical />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-[200px]">
										<DropdownMenuGroup>
											{booking.status === "pending" ? (
												<>
													<DropdownMenuItem className="flex gap-3">
														<NotebookPen className="h-4 w-4" />
														Edit
													</DropdownMenuItem>
													<DialogTrigger asChild>
														<DropdownMenuItem className="text-red-600 flex gap-3">
															<CalendarOff className="h-4 w-4" />
															Cancel Booking
														</DropdownMenuItem>
													</DialogTrigger>
												</>
											) : (
												<DropdownMenuItem
													className="flex gap-3"
													onClick={() => handleArchiveBooking(booking._id)}
												>
													<Archive className="h-4 w-4" />
													Archive
												</DropdownMenuItem>
											)}
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Cancel Booking</DialogTitle>
										<DialogDescription>
											Are you sure you want to cancel this booking? This action
											cannot be undone.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter className="sm:justify-between">
										<DialogClose asChild>
											<Button>Keep Booking</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button
												variant="outline"
												onClick={() => handleCancelBooking(booking._id)}
											>
												Cancel Booking
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>

						{/* Price summary */}
						<div className="flex items-center justify-between mt-4 pt-4 border-t">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="link" size="" className="gap-1 p-0">
										View Pricing Details
										<ChevronRight className="h-4 w-4" />
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[400px] max-h-[100vh] overflow-y-auto">
									<DialogHeader>
										<DialogTitle>Price Summary</DialogTitle>
									</DialogHeader>
									<PriceBreakdown />
								</DialogContent>
							</Dialog>
							<div className="flex items-center">
								<p className="text-sm text-muted-foreground mr-2">Total</p>
								<p className="text-lg font-bold">
									${booking.pricing.totalPrice}
								</p>
							</div>
						</div>
					</CardContent>

					<CardFooter className="bg-muted px-10 py-3 flex flex-col sm:flex-row justify-between gap-2">
						<p className="text-xs text-muted-foreground">
							Booked on{" "}
							{format(new Date(booking.createdAt), "MMM d, yyyy, h:mm a")}
						</p>
						<p className="h-fit p-0 text-xs text-muted-foreground">
							Booking ID:{" "}
							<span className="text-s font-bold">#{booking.bookingId}</span>
						</p>
					</CardFooter>
				</div>
			</div>
		</Card>
	);
}

export function BookingCardSkeleton() {
	return (
		<Card className="w-full overflow-hidden">
			<div className="flex flex-col md:flex-row">
				<div className="relative md:w-1/3 p-0">
					<Skeleton className="w-full h-[300px]" />
					<Skeleton className="absolute top-6 right-6 w-24 h-6" />
					<div className="absolute bottom-6 left-6 space-y-2">
						<Skeleton className="w-48 h-8" />
						<Skeleton className="w-36 h-6" />
					</div>
				</div>
				<div className="flex-1 flex flex-col justify-between">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full  p-10 mb-3">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="space-y-2">
								<Skeleton className="w-24 h-4" />
								<Skeleton className="w-32 h-6" />
							</div>
						))}
					</div>
					<div className="flex items-center justify-between px-10 pt-4">
						<Skeleton className="w-32 h-6" />
						<Skeleton className="w-24 h-8" />
					</div>
					<div className="bg-muted px-10 py-3 mt-8 flex flex-col sm:flex-row justify-between gap-2">
						<Skeleton className="w-48 h-4" />
						<Skeleton className="w-36 h-4" />
					</div>
				</div>
			</div>
		</Card>
	);
}
