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
import { CircleUser } from "lucide-react";

function Navigation() {
	const { user } = useUser();
	return (
		<header className="flex-no-wrap overflow-y-hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8  py-4 lg:flex-wrap border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center space-x-8">
				<Link to="/" className="text-2xl font-bold ">
					Hotel Haven
				</Link>
			</div>

			<nav className="flex items-center space-x-6">
				{user?.publicMetadata.role === "admin" && (
					<Link
						to="/create-hotel"
						className="text-foreground/70 hover:text-foreground transition-colors"
					>
						Create Hotel
					</Link>
				)}
				<Link
					to="/hotels"
					className="text-foreground/70 hover:text-foreground transition-colors"
				>
					Explore Hotels
				</Link>
				<Button variant="ghost">
					<Globe className="h-5 w-5" />
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
						<Link to="/account">
							<CircleUser />
							My Account
						</Link>
					</Button>
				</SignedIn>
			</nav>
		</header>
	);
}

export default Navigation;
