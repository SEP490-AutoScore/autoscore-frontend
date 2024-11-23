"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
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
export type ScoredExam = {
  examPaperId: number;
  examCode: string;
  examPaperCode: string;
  semesterName: string;
  totalStudents: number;
};
async function exportListScore(examPaperId: number) {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.exportScore}?exampaperid=${examPaperId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to export scores");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scores_exam_${examPaperId}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Failed to export scores. Please try again.");
  }
}

export const columns: ColumnDef<ScoredExam>[] = [
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
    accessorKey: "examPaperCode",
    header: "Exam Paper Code",
  },
  {
    accessorKey: "semesterName",
    // header: "Semester Name",
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
    cell: ({ row }) => <div>{row.getValue("semesterName")}</div>,
    sortingFn: (rowA, rowB) => {
      const order: Record<string, number> = { Spring: 1, Summer: 2, Fall: 3 };
      const matchA = rowA.original.semesterName.match(/([A-Z]+)(\d+)/);
      const matchB = rowB.original.semesterName.match(/([A-Z]+)(\d+)/);

      if (!matchA || !matchB) return 0;

      const [, seasonA, yearA] = matchA;
      const [, seasonB, yearB] = matchB;

      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);

      return (order[seasonA] || 0) - (order[seasonB] || 0);
    },
  },
  {
    accessorKey: "totalStudents",
    header: "Total Students",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const scoredExam = row.original;

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
              onClick={() => navigator.clipboard.writeText(scoredExam.examCode)}
            >
              Copy Exam code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link to="/scores" state={{ examPaperId: scoredExam.examPaperId }}>
              <DropdownMenuItem>View list score</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => exportListScore(scoredExam.examPaperId)}
            >
              Export List Score
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
