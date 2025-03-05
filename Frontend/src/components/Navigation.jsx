import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from "react-router";
import { SignedIn, UserButton, SignedOut, useUser } from "@clerk/clerk-react";

function Navigation() {
	const { user } = useUser();
	return (
		<nav className="z-50 bg-black flex-no-wrap fixed top-0 flex w-full items-center justify-between px-8 text-white py-4 shadow-md shadow-black/10 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap">
			<div className="flex items-center space-x-8">
				<Link to="/" className="text-2xl font-bold ">
					Hotel Haven
				</Link>
				{user?.publicMetadata.role === "admin" && (
					<Link to="/create-hotel">Create Hotel</Link>
				)}
			</div>

			<div className="flex items-center space-x-4">
				<Button variant="ghost">
					<Globe className="h-5 w-5 mr-2" />
					EN
				</Button>
				<SignedOut>
					<Button variant="ghost" asChild>
						<Link to="/sign-in">Sign In</Link>
					</Button>
					<Button asChild>
						<Link to="/sign-up">Sign Up</Link>
					</Button>
				</SignedOut>
				<SignedIn>
					<UserButton />
					<Button asChild>
						<Link to="/account">My Account</Link>
					</Button>
				</SignedIn>
			</div>
		</nav>
	);
}

export default Navigation;
