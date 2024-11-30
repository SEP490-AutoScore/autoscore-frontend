import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceDetails } from "./data-table-sources";

export const columns: ColumnDef<SourceDetails>[] = [
  {
    accessorKey: "studentCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student Code <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "studentEmail",
    header: "Email",
  },
  {
    accessorKey: "sourcePath",
    header: "Source Path",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
