import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md",
        className
      )}
    ></div>
  );
}
