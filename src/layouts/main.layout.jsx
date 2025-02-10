import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Outlet } from "react-router";

function MainLayout() {
	return (
		<main>
			<Navigation />
			<Outlet />
			<Footer />
		</main>
	);
}

export default MainLayout;
