import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CancellationPolicy from "@/components/CancellationPolicy";

const CancelBookingDialog = ({
	isOpen,
	onOpenChange,
	selectedBooking,
	cancellationReason,
	setCancellationReason,
	onCancel,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Cancel Booking</DialogTitle>
					<DialogDescription>
						Are you sure you want to cancel your booking at{" "}
						{selectedBooking?.hotel?.name}?
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="bg-muted p-3 rounded-md text-sm">
						<h4 className="font-medium mb-1">Cancellation Policy</h4>
						<CancellationPolicy selectedBooking={selectedBooking} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
						<Textarea
							id="reason"
							placeholder="Please let us know why you're cancelling..."
							className="min-h-[100px]"
							value={cancellationReason}
							onChange={(e) => setCancellationReason(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Keep Booking
					</Button>
					<Button variant="destructive" onClick={onCancel}>
						Cancel Booking
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CancelBookingDialog;
