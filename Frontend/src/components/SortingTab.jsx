import { Button } from "@/components/ui/button";

export function SortingTab({ sorting, selectedSorting, onClick }) {
	const handleClick = () => {
		onClick(sorting);
	};

	return (
		<Button
			variant={selectedSorting === sorting ? "default" : "outline"}
			className="rounded-full"
			onClick={handleClick}
		>
			{sorting}
		</Button>
	);
}
