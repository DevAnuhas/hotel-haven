import { Button } from "@/components/ui/button";

export function SortingTab({ sorting, selectedSorting, onClick }) {
	const handleClick = () => {
		onClick(sorting.value);
	};

	return (
		<Button
			variant={selectedSorting === sorting.value ? "default" : "outline"}
			className="rounded-full"
			onClick={handleClick}
		>
			{sorting.name}
		</Button>
	);
}
