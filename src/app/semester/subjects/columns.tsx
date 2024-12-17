import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import UpdateSubjectDialog from "@/app/semester/subjects/update-subject"; // Import the dialog component
import { checkPermission } from "@/hooks/use-auth";

export type Subject = {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
};

export const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "subjectCode",
    header: "Subject Name",
  },
  {
    accessorKey: "subjectName",
    header: "Subject Code",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subject = row.original;
      const [openDialog, setOpenDialog] = useState(false);

      const handleUpdate = () => {
        setOpenDialog(false); // Close dialog after update
        // Optionally trigger a data refresh here
      };
      const hasPermission = checkPermission({ permission: "CREATE_SUBJECT" });

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
                onClick={() => navigator.clipboard.writeText(subject.subjectCode)}
              >
                Copy subject code
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
          <UpdateSubjectDialog
            subjectId={subject.subjectId}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onUpdate={handleUpdate}
          />
        </>
      );
    },
  },
];
