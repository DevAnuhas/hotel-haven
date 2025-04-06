import { Component } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ratingCircleVariants = cva(
	"rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-shadow duration-300 ease-in-out",
	{
		variants: {
			rating: {
				excellent: "bg-green-600 group-hover:shadow-green-600/50",
				veryGood: "bg-green-500 group-hover:shadow-green-500/50",
				good: "bg-lime-500 group-hover:shadow-lime-500/50",
				average: "bg-amber-500 group-hover:shadow-amber-500/50",
				belowAverage: "bg-orange-500 group-hover:shadow-orange-500/50",
				poor: "bg-red-500 group-hover:shadow-red-500/50",
			},
			size: {
				lg: "text-2xl w-12 h-12",
				md: "text-lg w-10 h-10",
				sm: "text-md w-8 h-8",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
);

const categoryTextVariants = cva("font-medium", {
	variants: {
		size: {
			lg: "text-lg",
			md: "text-md",
			sm: "text-sm",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const reviewTextVariants = cva("text-muted-foreground", {
	variants: {
		size: {
			lg: "text-md",
			md: "text-sm",
			sm: "text-xs",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export class HotelRating extends Component {
	getRatingCategory(rating) {
		if (rating >= 9) return "excellent";
		if (rating >= 8) return "veryGood";
		if (rating >= 7) return "good";
		if (rating >= 6) return "average";
		if (rating >= 5) return "belowAverage";
		return "poor";
	}

	getDisplayCategory(rating) {
		if (rating >= 9) return "Excellent";
		if (rating >= 8) return "Very Good";
		if (rating >= 7) return "Good";
		if (rating >= 6) return "Average";
		if (rating >= 5) return "Below Average";
		return "Poor";
	}

	render() {
		const { rating, size } = this.props;
		const ratingCategory = this.getRatingCategory(rating.average);

		return (
			<div className="text-right">
				<div className="flex items-center justify-end gap-3 mb-1">
					<div className="flex flex-col">
						<span className={cn(categoryTextVariants({ size }))}>
							{this.getDisplayCategory(rating.average)}
						</span>
						<span className={cn(reviewTextVariants({ size }))}>
							{rating.count} reviews
						</span>
					</div>
					<div
						className={cn(
							ratingCircleVariants({
								rating: ratingCategory,
								size,
							})
						)}
					>
						{rating.average.toFixed(1)}
					</div>
				</div>
			</div>
		);
	}
}
