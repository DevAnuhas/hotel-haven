import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useCreateHotelMutation } from "@/lib/api";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	location: z.string().min(2, {
		message: "Location must be at least 2 characters.",
	}),
	image: z.string().min(1, {
		message: "Image must be at least 1 character.",
	}),
	price: z.number().min(1, {
		message: "Price must be at least 1 dollar.",
	}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters.",
	}),
});

export function CreateHotelForm() {
	const form = useForm({
		resolver: zodResolver(formSchema),
	});

	const [createHotel] = useCreateHotelMutation();

	const onSubmit = async (values) => {
		const loadingToastId = toast.loading("Creating hotel...");
		const { name, location, image, price, description } = values;
		try {
			await createHotel({
				name,
				location,
				image,
				price,
				description,
			}).unwrap();
			toast.dismiss(loadingToastId);
			toast.success("Hotel created successfully");
		} catch (error) {
			toast.dismiss(loadingToastId);
			toast.error(error.data.message);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hotel Name</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input placeholder="" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image URL</FormLabel>
							<FormControl>
								<Input placeholder="https://" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price per Night</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="$"
									onChange={(e) => {
										field.onChange(parseFloat(e.target.value));
									}}
									value={field.value}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Create</Button>
			</form>
		</Form>
	);
}
