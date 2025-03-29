import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Users } from "lucide-react";

export function GuestSelector({
	adults,
	children,
	onGuestsChange,
	maxOccupancy,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const totalGuests = adults + children;
	const isAtMaxCapacity = totalGuests >= maxOccupancy;

	const handleAdultsChange = (increment) => {
		const newAdults = Math.max(1, adults + increment);
		if (newAdults + children <= maxOccupancy) {
			onGuestsChange(newAdults, children);
		}
	};

	const handleChildrenChange = (increment) => {
		const newChildren = Math.max(0, children + increment);
		if (adults + newChildren <= maxOccupancy) {
			onGuestsChange(adults, newChildren);
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="w-full justify-start">
					<Users className="mr-2 h-4 w-4" />
					<span>
						{adults} {adults === 1 ? "adult" : "adults"}
						{children > 0 &&
							`, ${children} ${children === 1 ? "child" : "children"}`}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Guests</h4>
						<p className="text-sm text-muted-foreground">
							{maxOccupancy
								? `Maximum occupancy: ${maxOccupancy} guests`
								: "Please select a room to change maximum occupancy"}
						</p>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center justify-between">
							<div className="grid gap-1">
								<div className="font-medium">Adults</div>
								<div className="text-sm text-muted-foreground">Age 13+</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={() => handleAdultsChange(-1)}
									disabled={adults <= 1 || !maxOccupancy}
								>
									-
								</Button>
								<span className="w-4 text-center">{adults}</span>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={() => handleAdultsChange(1)}
									disabled={isAtMaxCapacity || !maxOccupancy}
								>
									+
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="grid gap-1">
								<div className="font-medium">Children</div>
								<div className="text-sm text-muted-foreground">Ages 0-12</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={() => handleChildrenChange(-1)}
									disabled={children <= 0 || !maxOccupancy}
								>
									-
								</Button>
								<span className="w-4 text-center">{children}</span>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={() => handleChildrenChange(1)}
									disabled={isAtMaxCapacity || !maxOccupancy}
								>
									+
								</Button>
							</div>
						</div>
					</div>
					<Button onClick={() => setIsOpen(false)}>Apply</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
