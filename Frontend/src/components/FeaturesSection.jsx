import { Brain, Globe, BookMarked, HeartHandshake } from "lucide-react";

function Features() {
	const features = [
		{
			icon: Brain,
			title: "AI-Powered Search",
			description: "Get personalized recommendations in seconds.",
		},
		{
			icon: Globe,
			title: "Global Reach",
			description: "Explore stays across 50+ countries.",
		},
		{
			icon: BookMarked,
			title: "Seamless Booking",
			description: "Secure and hassle-free reservation system.",
		},
		{
			icon: HeartHandshake,
			title: "24/7 Support",
			description: "Dedicated customer service whenever you need.",
		},
	];

	return (
		<section className="bg-muted">
			<div className="container mx-auto py-6 md:py-12 lg:py-16">
				<div className="mb-6 pb-4 space-y-3">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
						Why Choose StayGenius
					</h2>
					<p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Experience seamless travel planning with our unique features.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mx-auto">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={index}
								className="flex flex-col items-center text-center border-2 border-gray-300 p-6 rounded-xl"
							>
								<Icon size={40} />
								<h3 className="text-2xl font-semibold mt-4">{feature.title}</h3>
								<p className="text-muted-foreground mt-2">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default Features;
