import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonHotelCard() {
	return (
		<div>
			{/* Image skeleton */}
			<div className="relative aspect-[4/3] overflow-hidden rounded-xl">
				<Skeleton className="absolute inset-0" />
			</div>

			{/* Content skeleton */}
			<div className="mt-3 space-y-2 p-4">
				{/* Hotel name skeleton */}
				<Skeleton className="h-7 w-3/4" />

				{/* Location skeleton */}
				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Rating skeleton */}
				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-8" />
					<Skeleton className="h-4 w-24" />
				</div>

				{/* Price skeleton */}
				<div className="flex items-baseline">
					<Skeleton className="h-7 w-20" />
				</div>
			</div>
		</div>
	);
}
