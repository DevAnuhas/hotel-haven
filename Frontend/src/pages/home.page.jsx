import "@/App.css";
import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListings";
import Features from "@/components/FeaturesSection";
import CarouselPlugin from "@/components/Carousel";
import Testimonials from "@/components/Testimonials";

function HomePage() {
	return (
		<>
			<Hero />
			<HotelListings />
			<CarouselPlugin />
			<Features />
			<Testimonials />
		</>
	);
}

export default HomePage;
