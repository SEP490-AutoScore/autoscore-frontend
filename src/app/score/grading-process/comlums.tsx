"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
// import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Source = {
    sourceId: number;
    examPaper: {
        examPaperId: number;
        examPaperCode: string;
        duration: string;
    }
};

export const columns: ColumnDef<Source>[] = [
    {
        accessorKey: "examPaper.examPaperCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Exam Paper Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "examPaper.duration",
        header: "Duration",
    },
    // {
    //   accessorKey: "semester.semesterName",
    //   header: "Semester",
    // },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const data = row.original;
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
                            onClick={() =>
                                navigator.clipboard.writeText(data.sourceId.toString())
                            }
                        >
                            Copy Exam ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link to="/grading/students" state={{ examPaperId: data.examPaper.examPaperId }}>
                            <DropdownMenuItem>View Students</DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
