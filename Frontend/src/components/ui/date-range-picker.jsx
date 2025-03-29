import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({ className, dateRange, onDateRangeChange }) {
	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!dateRange && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{dateRange?.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} -{" "}
									{format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							<span>Select dates</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={dateRange?.from}
						selected={dateRange}
						onSelect={onDateRangeChange}
						numberOfMonths={2}
						disabled={{ before: new Date() }}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
