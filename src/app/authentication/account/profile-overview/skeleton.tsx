import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        {/* Avatar and Name Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/3 animate-pulse bg-muted" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-32 h-32 rounded-full animate-pulse bg-muted" />
              <Skeleton className="h-6 w-1/2 animate-pulse bg-muted" />
            </div>
          </CardContent>
        </Card>
        {/* Change Password Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/3 bg-muted" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 bg-muted" />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* User Information Skeleton */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/3 bg-muted" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 bg-muted" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
