"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { Link } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Score = {
  id: string;
  examId: string;
  examPaperId: string;
  studentCode: string;
  studentEmail: string;
  gratedAt: Date;
  totalScore: number;
  reason: string;
};
export const columns: ColumnDef<Score>[] = [
  {
    accessorKey: "studentCode",
    header: "Student Code",
  },
  {
    accessorKey: "studentEmail",
    header: "Email",
  },
  {
    accessorKey: "gradedAt",
    header: "Graded At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("gradedAt"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "totalScore",
    header: "Score",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const score = row.original;

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
              onClick={() => navigator.clipboard.writeText(score.studentCode)}
            >
              Copy student code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link to="/exams/exam-papers/plagiarism" state={{ scoreId: score.id, examId: score.examId, examPaperId: score.examPaperId }}>
            <DropdownMenuItem>View plagiarism</DropdownMenuItem></Link>
            <Link to="/exams/exam-papers/score-details" state={{ scoreId: score.id, examId: score.examId, examPaperId: score.examPaperId }}>
              <DropdownMenuItem>View score details</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
