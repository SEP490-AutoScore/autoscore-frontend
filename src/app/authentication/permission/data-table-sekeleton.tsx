import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div className="w-full border border-gray-200 p-8 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex w-full">
          <div className="flex-1">
            <div className="h-12 bg-muted w-48 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 bg-muted w-64 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="h-10 bg-muted w-32 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between py-4">
        <div className="w-1/4 h-6 bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-4">
              {[...Array(3)].map((_, index) => (
                <TableHead
                  key={index}
                  className={`
                    px-4 py-2
                    ${index === 2 ? "col-span-2" : "col-span-1"} 
                  `}
                >
                  <div className="h-6 bg-muted w-24 rounded-md animate-pulse"></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(6)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className="grid grid-cols-4">
                {[...Array(3)].map((_, cellIndex) => (
                  <TableCell key={cellIndex} className={`
                    px-4 py-2
                    ${cellIndex === 2 ? "col-span-2" : "col-span-1"} 
                  `}>
                    <div className="h-4 bg-muted w-2/3 rounded-md animate-pulse"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between pt-8 py-4">
        <div className="w-1/4 h-6 bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-4">
              {[...Array(3)].map((_, index) => (
                <TableHead
                  key={index}
                  className={`
                    px-4 py-2
                    ${index === 2 ? "col-span-2" : "col-span-1"} 
                  `}
                >
                  <div className="h-6 bg-muted w-24 rounded-md animate-pulse"></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(6)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className="grid grid-cols-4">
                {[...Array(3)].map((_, cellIndex) => (
                  <TableCell key={cellIndex} className={`
                    px-4 py-2
                    ${cellIndex === 2 ? "col-span-2" : "col-span-1"} 
                  `}>
                    <div className="h-4 bg-muted w-2/3 rounded-md animate-pulse"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
