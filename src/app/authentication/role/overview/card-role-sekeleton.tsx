import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CardRoleSkeleton() {
  return (
    <div className="w-full border border-gray-200 p-8 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex w-full">
          <div className="flex-1">
            <div className="h-12 bg-muted w-48 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 bg-muted w-64 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 bg-muted w-64 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="h-10 bg-muted w-32 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10 pt-10">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="h-6 bg-muted w-28 rounded-md animate-pulse"></CardTitle>
              <div className="h-6 bg-muted w-4 rounded-md animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted w-full rounded-md animate-pulse mb-2"></div>
              <div className="h-4 bg-muted w-64 rounded-md animate-pulse mb-2"></div>
            </CardContent>
            <Separator className="my-4"/>
            <CardFooter>
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted w-20 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-muted w-28 rounded-md animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="h-4 bg-muted w-28 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-muted w-28 rounded-md animate-pulse"></div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
