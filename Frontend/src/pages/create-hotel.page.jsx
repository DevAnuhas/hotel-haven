import { CreateHotelForm } from "@/components/CreateHotelForm";

function CreateHotelPage() {
	return (
		<div className="container w-full py-6 md:py-12 lg:py-16 mt-24 mx-auto">
			<div className="mb-6 space-y-3">
				<h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					Create a new hotel
				</h2>

				<p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
					Fill out the form below to create a new hotel.
				</p>
				<div className="flex *:mt-4 w-96">
					<CreateHotelForm />
				</div>
			</div>
		</div>
	);
}

export default CreateHotelPage;
