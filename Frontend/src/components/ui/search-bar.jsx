import "@/components/ui/search-bar.css";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Input = () => {
	return (
		<div className="w-full h-full">
			<div id="poda">
				<div className="glow" />
				<div className="darkBorderBg" />
				<div className="darkBorderBg" />
				<div className="darkBorderBg" />
				<div className="white rounded-full max-w-full max-h-full filter-blur-2px" />
				<div className="input-border rounded-full max-w-full max-h-full" />
				<div id="main" className="flex items-center justify-center">
					<input
						placeholder="Describe your destination, experience, or hotel..."
						type="text"
						name="search"
						className="input rounded-full w-[calc(100%-2px)] h-[calc(100%-2px)] px-8 py-2 text-white placeholder:text-white/50 border-none outline-none shadow-none bg-[#010201]"
					/>
					<div id="input-mask" />
					<div className="searchBorder rounded-full md:w-[194px] w-[130px] h-[calc(100%-15px)]" />
					<Button
						type="submit"
						className="search-button rounded-full w-32 md:w-48 h-[calc(100%-16px)] flex items-center  gap-x-2 hover:bg-[rgb(23, 23, 23)]"
					>
						<Sparkles className="w-5 h-5 mr-2 animate-pulse text-sky-400" />
						<span className="md:text-lg">AI Search</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

Input.displayName = "Input";

export { Input };
