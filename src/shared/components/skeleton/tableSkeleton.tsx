import { Skeleton } from "@/shared/ui/skeleton"

interface TableSkeletonProps {
    rows?: number
    columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <div className="flex w-full max-w-sm flex-col gap-2">
            {[...Array(rows)].map((_, index) => (
                <div className="flex gap-4" key={index}>
                    {[...Array(columns)].map((_, indexc) => (
                        <Skeleton className="h-4 flex-1" key={indexc} />
                    ))}
                </div>
            ))}
        </div>
    )
}