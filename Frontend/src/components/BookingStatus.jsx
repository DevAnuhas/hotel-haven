import { Clock, CheckCircle, XCircle, ArchiveIcon } from "lucide-react";

const BookingStatus = ({ status, refundAmount }) => {
	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return <Clock className="h-5 w-5 text-yellow-500" />;
			case "confirmed":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "completed":
				return <CheckCircle className="h-5 w-5 text-blue-500" />;
			case "cancelled":
				return <XCircle className="h-5 w-5 text-red-500" />;
			case "archived":
				return <ArchiveIcon className="h-5 w-5 text-gray-500" />;
		}
	};

	const statusText = {
		pending: "Awaiting payment",
		confirmed: "Booking confirmed",
		completed: "Stay completed",
		cancelled: "Booking cancelled",
		archived: "Booking archived",
	};

	return (
		<div className="flex items-center gap-2">
			{getStatusIcon(status)}
			<div className="text-sm">
				<p className="font-medium">{statusText[status]}</p>
				{status === "cancelled" && (
					<p className="text-muted-foreground">
						{refundAmount > 0
							? `Refunded: $${refundAmount.toFixed(2)}`
							: "No refund applied"}
					</p>
				)}
			</div>
		</div>
	);
};

export default BookingStatus;
