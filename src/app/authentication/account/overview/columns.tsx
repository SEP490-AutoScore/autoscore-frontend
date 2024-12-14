"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Dialog } from "@/components/ui/dialog";
import { DialogUpdateAccount } from "../update/dialog";
import { DeleteDialog } from "../delete/dialog";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { checkPermission } from "@/hooks/use-auth";

interface Account {
  accountId: number;
  name: string;
  email: string;
  role: string;
  position: string;
  campus: string;
  employeeCode: string;
  avatar: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

type ActionsCellProps = {
  account: {
    accountId: number;
    status: string;
  };
};

function ActionsCell({ account }: ActionsCellProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(`${BASE_URL}${API_ENDPOINTS.deleteAccount}${account.accountId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          showToast({
            title: "Delete Successfully",
            description: "Permission deleted successfully.",
          });
          setOpenDeleteDialog(false);
          navigate("/accounts", { state: { reload: true } });
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
            disabled={!checkPermission({ permission: "UPDATE_ACCOUNT" })}
          >
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)} // Mở dialog delete
            disabled={!checkPermission({ permission: "DELETE_ACCOUNT" })}
          >
            {account.status == "Active" ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogUpdateAccount
          accountId={account.accountId}
          onSuccess={handleCloseDialog}
        />
      </Dialog>

      <DeleteDialog
        open={openDeleteDialog} // Truyền trạng thái
        onOpenChange={setOpenDeleteDialog} // Đồng bộ trạng thái
        onDeleteConfirm={handleDelete} // Hành động khi confirm
        status={account.status}
      />
    </>
  );
}

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "email",
    header: "Name",
    cell: ({ row }) => {
      return (
        // Bạn cần return JSX từ đây
        <div className="flex items-center space-x-2 px-4 py-1">
          <Avatar>
            <AvatarImage
              src={`${
                row.original.avatar
                  ? row.original.avatar
                  : "https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg"
              }`}
            />
            <AvatarFallback>
              {row.original.name.charAt(0).toUpperCase()}{" "}
              {/* Sử dụng ký tự đầu của tên */}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{row.original.name}</span>
            <span className="truncate text-xs">{row.original.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "employeeCode",
    header: "ID",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "campus",
    header: "Campus",
  },
  {
    accessorKey: "position",
    header: "Department",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div
          className={
            status == "Active"
              ? "text-secondary font-semibold"
              : "font-semibold text-destructive"
          }
        >
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell account={row.original} />
    ),
  },
];
