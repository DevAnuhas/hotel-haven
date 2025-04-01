import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ReviewDialog = ({
	isOpen,
	onOpenChange,
	selectedBooking,
	rating,
	setRating,
	reviewTitle,
	setReviewTitle,
	reviewComment,
	setReviewComment,
	onSubmit,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Leave a Review</DialogTitle>
					<DialogDescription>
						Share your experience at {selectedBooking?.hotel?.name}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="rating">Rating (1-10)</Label>
						<div className="flex items-center gap-4">
							<input
								type="range"
								min="1"
								max="10"
								value={rating}
								onChange={(e) => setRating(Number.parseInt(e.target.value))}
								className="w-full"
							/>
							<span className="font-bold text-lg">{rating}</span>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="title">Review Title</Label>
						<Input
							id="title"
							placeholder="Summarize your experience"
							value={reviewTitle}
							onChange={(e) => setReviewTitle(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="comment">Your Review</Label>
						<Textarea
							id="comment"
							placeholder="Tell us about your stay..."
							className="min-h-[100px]"
							value={reviewComment}
							onChange={(e) => setReviewComment(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={onSubmit}>Submit Review</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ReviewDialog;
