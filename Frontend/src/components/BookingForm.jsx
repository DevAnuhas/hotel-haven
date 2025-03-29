import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useCreateBookingMutation } from "@/lib/api";

const bookingFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: "First name must be at least 2 characters." }),
	lastName: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters." }),
	email: z.string().email({ message: "Please enter a valid email address." }),
	phone: z.string().min(10, { message: "Please enter a valid phone number." }),
	specialRequests: z.string().optional(),
});

export function BookingForm({
	hotelId,
	roomId,
	checkIn,
	checkOut,
	adults,
	children,
	price,
	tax,
	onSuccess,
}) {
	const { user, isLoaded } = useUser();
	const [isProcessing, setIsProcessing] = useState(false);

	const form = useForm({
		resolver: zodResolver(bookingFormSchema),
	});

	useEffect(() => {
		if (isLoaded && user) {
			form.reset({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.primaryEmailAddress?.emailAddress || "",
				phone: user.primaryPhoneNumber?.phoneNumber || "",
				specialRequests: form.getValues("specialRequests"),
			});
		}
	}, [form, isLoaded, user]);

	const [createBooking] = useCreateBookingMutation();

	const onSubmit = async (values) => {
		setIsProcessing(true);
		const loadingToastId = toast.loading("Creating booking...");
		try {
			const checkInDate = new Date(checkIn);
			const checkOutDate = new Date(checkOut);

			const response = await createBooking({
				hotelId: hotelId,
				roomId: roomId,
				checkInDate: checkInDate.toISOString(),
				checkOutDate: checkOutDate.toISOString(),
				adults: adults,
				children: children,
				price: price,
				tax: tax,
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phone: values.phone,
				specialRequests: values.specialRequests,
			}).unwrap();
			toast.dismiss(loadingToastId);
			toast.success("Booking created successfully");
			onSuccess(response.bookingId);
		} catch (error) {
			console.log(error);
			toast.dismiss(loadingToastId);
			toast.error("Unable to complete booking");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input {...field} />
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
									<Input type="email" {...field} />
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
									<Input type="tel" {...field} />
								</FormControl>
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
							<FormLabel>Special Requests (optional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Let us know if you have any special requests or requirements"
									className="min-h-[100px] resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Special requests cannot be guaranteed but the hotel will do its
								best to accommodate your needs.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isProcessing}>
					{isProcessing ? "Processing..." : "Continue to Payment"}
				</Button>
			</form>
		</Form>
	);
}
