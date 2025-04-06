import {
	Sparkles,
	TextSearch,
	BadgePercent,
	HeartHandshake,
} from "lucide-react";

function Features() {
	const features = [
		{
			icon: Sparkles,
			title: "AI-Powered Recommendations",
			description:
				"Our smart AI analyzes your preferences to suggest hotels that perfectly match your needs and style.",
		},
		{
			icon: TextSearch,
			title: "Advanced Search Filters",
			description:
				"Find exactly what you're looking for with our detailed and customizable search options.",
		},
		{
			icon: BadgePercent,
			title: "Best Price Guarantee",
			description:
				"We promise you'll get the best available rates with our price match policy.",
		},
		{
			icon: HeartHandshake,
			title: "24/7 Customer Support",
			description:
				"Our dedicated support team is always ready to assist you with any queries or issues.",
		},
	];

	return (
		<section className="bg-muted">
			<div className="container mx-auto px-8 py-20 md:py-24">
				<div className="mb-6 pb-4 space-y-3">
					<h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
						Why Choose StayGenius?
					</h2>
					<p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Experience the future of hotel booking with our AI-powered platform
						that makes finding your perfect stay easier than ever.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mx-auto gap-8">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={index}
								className="relative flex flex-col border transition-all duration-300 border-primary/30 hover:border-primary hover:shadow-md p-6 rounded-xl"
							>
								<Icon
									size={48}
									className="z-10 bg-foreground text-background p-2 rounded-full"
								/>
								<h3 className="z-10 text-2xl font-semibold mt-4">
									{feature.title}
								</h3>
								<p className="z-10 text-muted-foreground mt-2">
									{feature.description}
								</p>
								<Icon
									size={180}
									className="absolute -z-1 right-0 bottom-0 mx-auto opacity-5 "
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default Features;
