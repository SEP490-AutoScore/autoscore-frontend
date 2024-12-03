// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Permission } from "./data-table-permission-category";
import { Switch } from "@/components/ui/switch";
import { checkPermission } from "@/hooks/use-auth";

export const createColumns = (onUpdateStatus: (id: number, status: boolean) => void): ColumnDef<Permission>[] => [
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
        disabled={!checkPermission({ permission: "UPDATE_ROLE_PERMISSION" })}
        onCheckedChange={(checked) => {
          const permissionId = row.original.permissionId;
          onUpdateStatus(permissionId, checked);
        }}
        className="group-hover:ring-2 group-hover:ring-primary-foreground transition-all duration-300"
      />
    ),
  },
];