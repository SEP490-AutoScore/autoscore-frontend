import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import UpdateSemesterDialog from "@/app/semester/semesters/update-semester"; // Import the dialog
import { checkPermission } from "@/hooks/use-auth";

export type Semester = {
  semesterId: number;
  semesterName: string;
  semesterCode: string;
};

export const columns: ColumnDef<Semester>[] = [
  {
    accessorKey: "semesterName",
    header: "Semester Name",
  },
  {
    accessorKey: "semesterCode",
    header: "Semester Code",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const semester = row.original;
      const [openDialog, setOpenDialog] = useState(false);

      const handleUpdate = () => {
        setOpenDialog(false); // Close dialog after update
        // Optionally trigger a data refresh here
      };
      const hasPermission = checkPermission({ permission: "CREATE_SEMESTER" });

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(semester.semesterCode)}
              >
                Copy semester code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {hasPermission && (
                <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                  Update
                </DropdownMenuItem>
              )}

            </DropdownMenuContent>
          </DropdownMenu>

          {/* Render the update dialog */}
          <UpdateSemesterDialog
            semesterId={semester.semesterId}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onUpdate={handleUpdate}
          />
        </>
      );
    },
  },
];
