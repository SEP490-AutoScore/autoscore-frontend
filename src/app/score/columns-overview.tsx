"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
export type Subject = {
  code: string;
  semester: string; // Adjusted to string to match FA24, SU24, etc.
  status: "pending" | "processing" | "success" | "failed";
  subject: string;
};

export const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "semester",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Semester
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("semester")}</div>,
    sortingFn: (rowA, rowB) => {
      const order: Record<string, number> = { SP: 1, SU: 2, FA: 3 };
      const matchA = rowA.original.semester.match(/([A-Z]+)(\d+)/);
      const matchB = rowB.original.semester.match(/([A-Z]+)(\d+)/);

      if (!matchA || !matchB) return 0;
    
      const [, seasonA, yearA] = matchA;
      const [, seasonB, yearB] = matchB;
    
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);

      return (order[seasonA] || 0) - (order[seasonB] || 0);
    }
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subject = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(subject.code)}
            >
              Copy subject code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View student</DropdownMenuItem>
            <DropdownMenuItem>View score details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
