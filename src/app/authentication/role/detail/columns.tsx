import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Permission } from "./data-table-permission-category";
import { Switch } from "@/components/ui/switch";

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "action",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Action <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "permissionName",
    header: "Permission Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description") || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Switch
        checked={row.getValue("status")}
        disabled
        aria-readonly
        className="group-hover:ring-2 group-hover:ring-primary-foreground transition-all duration-300"
      />
    ),
  },
  
];
