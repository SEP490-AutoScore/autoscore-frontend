"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Exams = {
  examId: number;
  examCode: string;
  examAt: Date;
  gradingAt: Date;
  publishAt: Date;
  semester: {
    semesterId: number;
    semesterCode: string;
    semesterName: string;
  };
  subject: {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
  };
};

type ActionsCellProps = {
  exam: {
    examId: number;
  };
};

function ActionsCell({ exam }: ActionsCellProps) {

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
          <Link to="/exams/exam-papers" state={{ examId: exam.examId }}>
            <DropdownMenuItem className="cursor-pointer">
              View Exam Details
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">Delete Exam</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      
    </>
  );
}

export const columns: ColumnDef<Exams>[] = [
  {
    accessorKey: "examCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Exam Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "examAt",
    header: "Exam Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("examAt"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "gradingAt",
    header: "Grading Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("gradingAt"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "publishAt",
    header: "Publish Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("publishAt"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "semester.semesterName",
    header: "Semester",
  },
  {
    accessorKey: "subject.subjectName",
    header: "Subject",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell exam={row.original} />, // Sử dụng Component riêng
  },
];
