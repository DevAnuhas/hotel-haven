import * as React from "react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";

export function CarouselPlugin() {
	const slides = [
        {
            image: "./src/assets/carousel-1.jpg",
            title: "Beachfront Bliss",
            desciption: "Unwind at stunning beach resorts worldwide.",
        },
        {
            image: "./src/assets/carousel-2.jpg",
            title: "Urban Luxury",
            desciption: "Stay in the heart of vibrant cities with top-tier amenities.",
        },
		{
			image: "./src/assets/carousel-3.jpg",
			title: "Escape to Nature",
			desciption: "Discover peaceful retreats surrounded by natural beauty",
		},
	];

	const plugin = React.useRef(
		Autoplay({ delay: 3000, stopOnInteraction: true })
	);

	return (
		<section className="container mx-auto py-6 md:py-12 lg:py-16">
			<Carousel
				plugins={[plugin.current]}
				className="w-full relative"
				onMouseEnter={plugin.current.stop}
				onMouseLeave={plugin.current.reset}
				opts={{
					loop: true,
				}}
			>
				<CarouselContent>
					{slides.map((slide, index) => (
						<CarouselItem key={index}>
							<div className="p-1 select-none">
								<Card className="relative aspect-[3/1] overflow-hidden rounded-3xl">
									<CardContent className="absolute flex flex-col aspect-auto items-center justify-center gap-6 w-full h-full p-6 z-10">
										<h2 className="text-6xl font-semibold text-white">
											{slide.title}
										</h2>
										<p className="text-2xl font-medium text-white">
											{slide.desciption}
										</p>
										<Button
											className="rounded-full px-6 flex items-center gap-4 lg:h-12"
											variant="outline"
											onClick={() => window.open("/", "_self")}
										>
											<span className="lg:text-lg">Book Now</span>
                                            <ArrowRight />
										</Button>
									</CardContent>
									<img
										src={slide.image}
										alt="Carousel Image"
										className="w-full h-full object-cover"
									/>
									<div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</section>
	);
}

export default CarouselPlugin;
