import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

import { useCreateBookingMutation } from "@/lib/api";

// Schema for form validation
const bookingFormSchema = z
	.object({
		firstName: z
			.string()
			.min(2, { message: "First name must be at least 2 characters" }),
		lastName: z
			.string()
			.min(2, { message: "Last name must be at least 2 characters" }),
		email: z.string().email({ message: "Please enter a valid email address" }),
		phone: z.string().min(10, { message: "Please enter a valid phone number" }),
		checkInDate: z.date({
			required_error: "Please select an arrival date",
		}),
		checkOutDate: z.date({
			required_error: "Please select a departure date",
		}),
		roomType: z.string({
			required_error: "Please select a room type",
		}),
		adults: z.string(),
		children: z.string(),
		specialRequests: z.string().optional(),
	})
	.refine(
		(data) => {
			// Ensure departure date is after arrival date
			return data.checkOutDate > data.checkInDate;
		},
		{
			message: "Departure date must be after arrival date",
			path: ["checkInDate"],
		}
	);

export function BookingForm({ hotelId, onSuccess }) {
	const { user, isLoaded } = useUser();

	const form = useForm({
		resolver: zodResolver(bookingFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			checkInDate: undefined,
			checkOutDate: undefined,
			roomType: "",
			adults: "2",
			children: "0",
			specialRequests: "",
		},
	});

	useEffect(() => {
		if (isLoaded && user) {
			form.reset({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.primaryEmailAddress?.emailAddress || "",
				phone: user.primaryPhoneNumber?.phoneNumber || "",
				checkInDate: form.getValues("checkInDate"),
				checkOutDate: form.getValues("checkOutDate"),
				roomType: form.getValues("roomType"),
				adults: form.getValues("adults"),
				children: form.getValues("children"),
				specialRequests: form.getValues("specialRequests"),
			});
		}
	}, [form, isLoaded, user]);

	const [createBooking] = useCreateBookingMutation();

	const onSubmit = async (values) => {
		console.log("Form submitted:", values);
		const loadingToastId = toast.loading("Creating booking...");
		try {
			await createBooking({
				hotelId: hotelId,
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phone: values.phone,
				checkInDate: values.checkInDate.toISOString(),
				checkOutDate: values.checkOutDate.toISOString(),
				roomType: values.roomType,
				adults: values.adults,
				children: values.children,
				specialRequests: values.specialRequests,
			}).unwrap();
			toast.dismiss(loadingToastId);
			toast.success("Booking request submitted", {
				description:
					"Your booking has been received. We'll confirm your reservation shortly.",
				duration: 5000,
			});
			if (onSuccess) {
				onSuccess();
			}
		} catch {
			toast.dismiss(loadingToastId);
			toast.error("Unable to complete booking", {
				description:
					"There was an error processing your booking. Please try again or contact us directly.",
				duration: 5000,
			});
		}
	};

	// To calculate minimum departure date based on selected arrival date
	const checkInDate = form.watch("checkInDate");
	const minimumCheckOutDate = checkInDate ? new Date(checkInDate) : new Date();
	if (minimumCheckOutDate instanceof Date) {
		minimumCheckOutDate.setDate(minimumCheckOutDate.getDate() + 1);
	}

	return (
		<div className="p-2">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={user.firstName ? true : false}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input {...field} disabled={user.lastName ? true : false} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											{...field}
											disabled={
												user.primaryEmailAddress?.emailAddress ? true : false
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											placeholder="+94 71 234 5678"
											{...field}
											disabled={
												user.primaryPhoneNumber?.phoneNumber ? true : false
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="checkInDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Arrival Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Select date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) =>
													date < new Date(new Date().setHours(0, 0, 0, 0))
												}
												initialFocus
												className={cn("p-3 pointer-events-auto")}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="checkOutDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Departure Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Select date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date) => date < minimumCheckOutDate}
												initialFocus
												className={cn("p-3 pointer-events-auto")}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<FormField
							control={form.control}
							name="roomType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Room Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select room type" />
											</SelectTrigger>
										</FormControl>
										{/* TODO: Add dynamic options based on hotel */}
										<SelectContent>
											<SelectItem value="standard">Standard Room</SelectItem>
											<SelectItem value="deluxe">Deluxe Room</SelectItem>
											<SelectItem value="executive">Executive Suite</SelectItem>
											<SelectItem value="presidential">
												Presidential Suite
											</SelectItem>
											<SelectItem value="villa">Private Villa</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="adults"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Adults</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select number of adults" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="1">1</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4">4</SelectItem>
											<SelectItem value="5+">5+</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="children"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Children</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select number of children" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="0">0</SelectItem>
											<SelectItem value="1">1</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4+">4+</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="specialRequests"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Special Requests</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Please let us know if you have any special requests or requirements"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<DialogFooter className="sm:justify-between">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
						<Button type="submit">Submit Booking Request</Button>
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
}
