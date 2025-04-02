import { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function HotelImageCarousel({ images, className, autoplayDelay }) {
	const [api, setApi] = useState(null);
	const [current, setCurrent] = useState(0);
	const [showThumbnails, setShowThumbnails] = useState(true);

	// Set up autoplay plugin
	const autoplayOptions = {
		delay: autoplayDelay,
		stopOnInteraction: false,
		rootNode: (emblaRoot) => emblaRoot.parentElement,
	};

	const autoplayPlugin = Autoplay(autoplayOptions);

	// Handle slide change
	const onSelect = useCallback(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap());
	}, [api]);

	useEffect(() => {
		if (!api) return;

		onSelect();
		api.on("select", onSelect);
		api.on("reInit", onSelect);

		return () => {
			api.off("select", onSelect);
			api.off("reInit", onSelect);
		};
	}, [api, onSelect]);

	// Handle thumbnail click
	const scrollTo = useCallback(
		(index) => {
			if (!api) return;
			api.scrollTo(index);
		},
		[api]
	);

	useEffect(() => {
		const checkScreenSize = () => {
			setShowThumbnails(window.innerWidth >= 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => {
			window.removeEventListener("resize", checkScreenSize);
		};
	}, []);

	if (!images || images.length === 0) {
		return (
			<div
				className={cn(
					"relative aspect-[16/9] overflow-hidden rounded-lg bg-muted",
					className
				)}
			>
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Carousel
				setApi={setApi}
				plugins={[autoplayPlugin]}
				className={cn("w-full overflow-hidden rounded-lg", className)}
				opts={{
					align: "start",
					loop: true,
				}}
			>
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index}>
							<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
								<img
									src={image || "/assets/placeholder.svg"}
									alt={`Hotel image ${index + 1}`}
									className="object-cover"
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="left-2 bg-background/80 hover:bg-background" />
				<CarouselNext className="right-2 bg-background/80 hover:bg-background" />
			</Carousel>

			{showThumbnails && (
				<div className="flex space-x-2 overflow-x-auto pb-2">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => scrollTo(index)}
							className={cn(
								"relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
								current === index ? "border-primary" : "border-transparent"
							)}
							aria-label={`View image ${index + 1}`}
						>
							<img
								src={image || "/assets/placeholder.svg"}
								alt={`Thumbnail ${index + 1}`}
								className="object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
