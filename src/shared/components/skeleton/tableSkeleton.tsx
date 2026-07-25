import {Skeleton} from "@/shared/ui/skeleton"

interface TableSkeletonProps {
    rows?: number
    columns?: number
}

export function TableSkeleton({rows = 5, columns = 4}: TableSkeletonProps) {
    return (
        <div className="my-5">
            {[...Array(rows)].map((_, index) => (
                <div className="flex gap-2 my-5" key={index}>
                    {[...Array(columns)].map((_, indexc) => (
                        <Skeleton className="h-6 flex-1" key={indexc}/>
                    ))}
                </div>
            ))}
        </div>
    )
}