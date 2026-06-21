import { Skeleton } from "@/shared/ui/skeleton"

interface TableSkeletonProps {
    rows?: number
    columns?: number
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
                <div className={`grid grid-cols-${columns} gap-4`}>
                    {[...Array(columns)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="p-4 border-b last:border-b-0">
                    <div className={`grid grid-cols-${columns} gap-4 items-center`}>
                        {[...Array(columns)].map((_, j) => (
                            <Skeleton key={j} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}