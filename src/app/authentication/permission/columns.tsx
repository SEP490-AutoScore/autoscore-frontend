import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Permission } from "./data-table-permission-category";
import { Dialog } from "@/components/ui/dialog";
import { DialogPermission } from "./update/dialog";
import { DeleteDialog } from "./delete/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { API_ENDPOINTS, BASE_URL } from '@/config/apiConfig';
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useNavigate } from "react-router-dom";

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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <TablePermission permission={row.original} />;
    },
  },
];

const TablePermission = ({ permission }: { permission: Permission }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(`${BASE_URL}${API_ENDPOINTS.deletePermission}${permission.permissionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      }
    })
      .then((response) => {
        if (response.ok) {
          showToast({
            title: "Delete Successfully",
            description: "Permission deleted successfully.",
          });
          setOpenDeleteDialog(false);
          navigate("/permissions", { state: { reload: true } });
        } else {
          if (response.status === 400) {
            showToast({
              title: "Delete Failed",
              description: "Permission is associated with a role.",
              variant: "destructive",
            });
            return;
          }
          showToast({
            title: "Delete Failed",
            description: "Failed to delete permission.",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong",
          description: "Failed to delete permission.",
          variant: "destructive",
        });
      });
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDialog(true)} // Chỉ mở dialog
          >
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)} // Mở dialog delete
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogPermission
          permissionId={permission.permissionId}
          onSuccess={handleCloseDialog}
        />
      </Dialog>

      <DeleteDialog
        open={openDeleteDialog} // Truyền trạng thái
        onOpenChange={setOpenDeleteDialog} // Đồng bộ trạng thái
        onDeleteConfirm={handleDelete} // Hành động khi confirm
      />
    </>
  );
};
