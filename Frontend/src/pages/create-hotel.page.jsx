import { Button } from "@/components/ui/button";
import { useCreateHotelMutation } from "@/lib/api";
import { toast } from "sonner";

function CreateHotelPage() {
	const [createHotel] = useCreateHotelMutation();

	const handleClick = async () => {
		const loadingToastId = toast.loading("Creating hotel...");
		try {
			await createHotel({
				name: "Hotel Name",
				description: "Hotel Description",
				location: "City",
				price: 100,
				rating: 5,
				reviews: 100,
				image: "https://via.placeholder.com/150",
			}).unwrap();
			toast.dismiss(loadingToastId);
			toast.success("Hotel created successfully");
		} catch (error) {
			toast.dismiss(loadingToastId);
			toast.error(error.data.message);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 min-h-screen mt-24">
			<div className="text-center">
				<h1 className="text-2xl font-bold mb-4">Create a new Hotel</h1>
				<p className="text-muted-foreground"></p>
				<div className="flex justify-center mt-4">
					<Button onClick={handleClick}>Create Hotel</Button>
				</div>
			</div>
		</div>
	);
}

export default CreateHotelPage;
