import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from "react-router";
import {
	SignedIn,
	SignInButton,
	SignUpButton,
	UserButton,
	SignedOut,
	useUser,
} from "@clerk/clerk-react";

function Navigation() {
	const { user } = useUser();
	return (
		<nav className="bg-black flex-no-wrap overflow-y-hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 text-white py-4 shadow-md shadow-black/10 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap">
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
					<SignInButton mode="modal">
						<Button variant="ghost">Sign In</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button>Sign Up</Button>
					</SignUpButton>
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
