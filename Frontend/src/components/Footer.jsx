import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/theme-provider";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router";

function Footer() {
	const { theme } = useTheme();
	const quickLinks = [
		{
			title: "Explore Hotels",
			link: "/hotels",
		},
		{
			title: "Destinations",
			link: "/destinations",
		},
		{
			title: "Blog",
			link: "/blog",
		},
		{
			title: "About Us",
			link: "/about",
		},
	];
	const supportMenu = [
		{
			title: "FAQs",
			link: "/faqs",
		},
		{
			title: "Contact Us",
			link: "/contact",
		},
		{
			title: "Help Center",
			link: "/help",
		},
	];
	return (
		<footer className="bg-muted">
			<div className="container mx-auto px-8 py-12">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12">
					<div className="space-y-4 col-span-2 lg:col-span-1">
						<Link
							to="/"
							className="text-2xl font-serif font-bold flex items-center gap-2"
						>
							<img
								src={
									theme === "dark"
										? "./assets/staygenius-logo-white.png"
										: "./assets/staygenius-logo.png"
								}
								alt="StayGenius Logo"
								className="h-8"
							/>
							StayGenius
						</Link>
						<p className="text-sm text-muted-foreground">
							Find your perfect stay with AI-powered hotel recommendations
							tailored to your preferences.
						</p>
						<div className="flex gap-4">
							<a
								href="#"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<Instagram size={20} />
							</a>
							<a
								href="#"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<Twitter size={20} />
								<span className="sr-only">Twitter</span>
							</a>
							<a
								href="#"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<Facebook size={20} />
								<span className="sr-only">Facebook</span>
							</a>
						</div>
					</div>

					<div className="space-y-4 min-w-32 sm:ml-auto">
						<h3 className="text-lg font-semibold text-foreground">
							Quick Links
						</h3>
						<ul className="space-y-2">
							{quickLinks.map((item, index) => {
								return (
									<li key={index}>
										<a
											href={item.link}
											className="text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.title}
										</a>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="space-y-4 min-w-32 sm:ml-auto sm:order-3 lg:order-2">
						<h3 className="text-lg font-semibold text-foreground">Support</h3>
						<ul className="space-y-2">
							{supportMenu.map((item, index) => {
								return (
									<li key={index}>
										<a
											href={item.link}
											className="text-muted-foreground hover:text-foreground transition-colors"
										>
											{item.title}
										</a>
									</li>
								);
							})}
						</ul>
					</div>

					<div className="space-y-4 col-span-2 lg:col-span-1 sm:order-2 lg:order-3">
						<h3 className="text-lg font-semibold text-foreground">
							Get Updates
						</h3>
						<p className="text-sm text-muted-foreground">
							Subscribe to our newsletter to stay updated on our latest features
							and offers.
						</p>
						<form className="flex flex-col gap-2">
							<Input
								type="email"
								className="file:border-0 file:bg-transparent focus-visible:outline-none border-muted-foreground"
								placeholder="Enter your email"
								required
							/>
							<Button size="sm" type="submit">
								Subscribe
							</Button>
						</form>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-neutral-500">
					<p className="text-sm">
						©{new Date().getFullYear()} StayGenius. All rights reserved.
					</p>
					<div className="flex gap-4 mt-4 md:mt-0">
						<a
							href="/privacy"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy Policy
						</a>
						<a
							href="/terms"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms of Service
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
