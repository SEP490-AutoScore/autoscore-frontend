
export function DataTableSkeleton() {
  return (
    <div className="w-full border border-gray-200 p-8 rounded-lg">
      {/* Exam Information Header */}
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex flex-col space-y-2">
          <div className="h-6 bg-muted w-48 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 bg-muted w-64 rounded-md animate-pulse"></div>
        </div>
        <div className="h-10 bg-muted w-20 rounded-md animate-pulse"></div>
      </div>

      {/* Exam Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-4 bg-muted w-40 rounded-md animate-pulse"></div>
          <div className="h-4 bg-muted w-32 rounded-md animate-pulse"></div>
          <div className="h-4 bg-muted w-64 rounded-md animate-pulse"></div>
          <div className="h-4 bg-muted w-48 rounded-md animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted w-40 rounded-md animate-pulse"></div>
          <div className="h-4 bg-muted w-32 rounded-md animate-pulse"></div>
          <div className="h-4 bg-muted w-64 rounded-md animate-pulse"></div>
          <div className="h-4 bg-muted w-48 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Score Details */}
      <div className="space-y-2 mb-6">
        <div className="h-6 bg-muted w-48 rounded-md animate-pulse mb-4"></div>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <div className="h-4 bg-muted w-40 rounded-md animate-pulse"></div>
            <div className="h-4 bg-muted w-16 rounded-md animate-pulse"></div>
            <div className="h-4 bg-muted w-16 rounded-md animate-pulse"></div>
            <div className="h-4 bg-muted w-24 rounded-md animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
        <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}