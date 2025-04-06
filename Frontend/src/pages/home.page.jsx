import "@/App.css";
import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListings";
import Features from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";

function HomePage() {
	return (
		<>
			<Hero />
			<HotelListings />
			<Features />
			<Testimonials />
		</>
	);
}

export default HomePage;
