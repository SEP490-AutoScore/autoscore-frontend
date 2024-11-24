import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div className="w-full border border-gray-200 p-8 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <div className="h-12 bg-muted w-48 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 bg-muted w-64 rounded-md animate-pulse"></div>
        </div>
        {/* <div className="h-10 bg-muted w-20 rounded-md animate-pulse"></div> */}
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between py-4">
        <div className="w-1/3 h-8 bg-muted rounded-md animate-pulse"></div>
        <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(5)].map((_, index) => (
                <TableHead key={index}>
                  <div className="h-4 bg-muted w-24 rounded-md animate-pulse"></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(5)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div className="h-4 bg-muted w-full rounded-md animate-pulse"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        {/* <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div> */}
        <div className="flex space-x-2">
          <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
          <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
