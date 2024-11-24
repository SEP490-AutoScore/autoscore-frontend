"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Students = {
  studentCode: string;
  studentEmail: string;
  examCode: string;
  campus: string;
};

export const columns: ColumnDef<Students>[] = [
  {
    accessorKey: "studentCode",
    header: "Student Code",
  },
  {
    accessorKey: "studentEmail",
    header: "Email",
  },
  {
    accessorKey: "examCode",
    header: "Exam Code",
  },
  {
    accessorKey: "campus",
    header: "Campus",
  },
];
