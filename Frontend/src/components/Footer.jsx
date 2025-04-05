import { Instagram, Twitter, Facebook, MessageCircle } from "lucide-react";

function Footer() {
	const aboutMenu = [
		{
			title: "About Us",
			link: "/about",
		},
		{
			title: "Blog",
			link: "/blog",
		},
		{
			title: "Career",
			link: "/career",
		},
	];
	const supportMenu = [
		{
			title: "Contact Us",
			link: "/contact",
		},
		{
			title: "Help Center",
			link: "/help",
		},
		{
			title: "FAQs",
			link: "/faqs",
		},
	];
	return (
		<footer className="bg-muted">
			<div className="container mx-auto px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-4">
						<a
							href="/"
							className="text-2xl font-serif font-bold text-foreground flex items-center"
						>
							StayGenius
						</a>
						<p className="text-sm text-muted-foreground">
							StayGenius combines cutting-edge AI with user-friendly features to
							make hotel booking effortless and enjoyable.
						</p>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">About</h3>
						<ul className="space-y-2">
							{aboutMenu.map((item, index) => {
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
					<div className="space-y-4">
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
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">
							Get Updates
						</h3>
						<form className="flex gap-2">
							<input
								type="email"
								className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-muted-foreground/30 hover:bg-muted-foreground/20 border-muted-foreground placeholder:text-muted-foreground/80"
								placeholder="Enter your email"
								required
							/>
							<button
								className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
								type="submit"
							>
								Subscribe
							</button>
						</form>
						<div className="flex gap-4">
							<a
								href="https://instagram.com"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<Instagram size={20} />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<Twitter size={20} />
								<span className="sr-only">Twitter</span>
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<Facebook size={20} />
								<span className="sr-only">Facebook</span>
							</a>
							<a
								href="https://discord.com"
								target="_blank"
								className="bg-muted-foreground/30 hover:bg-muted-foreground/20 p-2 rounded-full transition-colors"
							>
								<MessageCircle size={20} />
								<span className="sr-only">Discord</span>
							</a>
						</div>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200">
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
