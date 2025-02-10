import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from "react-router";

function Navigation() {
	return (
		<nav className="z-50 bg-black flex-no-wrap fixed top-0 flex w-full items-center justify-between px-8 text-white py-4 shadow-md shadow-black/10 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap">
			<div className="flex items-center space-x-8">
				<Link to="/" className="text-2xl font-bold ">
					Hotel Haven
				</Link>
			</div>

			<div className="flex items-center space-x-4">
				<Button variant="ghost">
					<Globe className="h-5 w-5 mr-2" />
					EN
				</Button>
				<Button variant="ghost" asChild>
					<Link to="/log-in">Log In</Link>
				</Button>
				<Button asChild>
					<Link to="/sign-up">Sign Up</Link>
				</Button>
			</div>
		</nav>
	);
}

export default Navigation;
