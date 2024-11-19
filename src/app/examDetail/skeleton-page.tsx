import React from "react";
import { Skeleton } from "@/components/skeleton-loader";

const SkeletonPage: React.FC = () => {
    return (
        <div className="p-6">
            {/* Skeleton for the title */}
            <div className="mb-6 text-center">
                <Skeleton className="h-8 w-1/3 mx-auto" />
            </div>

            {/* Skeleton for a list of items */}
            <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border rounded-md p-4 bg-gray-50 shadow-sm">
                        {/* Skeleton for the question title */}
                        <Skeleton className="h-6 w-1/2 mb-4" />

                        {/* Skeleton for the question details */}
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonPage;
