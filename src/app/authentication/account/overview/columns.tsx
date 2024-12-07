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

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "email",
    header: "Name",
    cell: ({ row }) => {
      return ( // Bạn cần return JSX từ đây
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
              {row.original.name.charAt(0).toUpperCase()} {/* Sử dụng ký tự đầu của tên */}
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
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
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
            <DropdownMenuItem className="cursor-pointer">Update</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
