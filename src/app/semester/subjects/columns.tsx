"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subject = {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
};
export const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "subjectName",
    header: "Subject Name",
  },
  {
    accessorKey: "subjectCode",
    header: "Subject Code",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subject = row.original;

      return (
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(score.studentCode)}
            >
              Copy student code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link to="/scores-overview/scores/plagiarism" state={{ scoreId: score.id }}>
            <DropdownMenuItem>View plagiarism</DropdownMenuItem></Link>
            <Link to="/scores-overview/scores/score-details" state={{ scoreId: score.id }}>
              <DropdownMenuItem>View score details</DropdownMenuItem>
            </Link>
          </DropdownMenuContent> */}
        </DropdownMenu>
      );
    },
  },
];
