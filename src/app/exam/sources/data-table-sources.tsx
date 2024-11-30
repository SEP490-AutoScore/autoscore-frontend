import React from "react";
import { DataTable } from "@/app/exam/sources/data-table";
import { DataTableError } from "./data-table-student-error";
import { ColumnDef } from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface StudentErrors {
  studentCode: string;
  studentEmail: string;
  errorContent: string;
}

export interface SourceDetails {
  studentCode: string;
  studentEmail: string;
  sourcePath: string;
  type: string;
}

export interface Sources {
  examCode: string;
  examPaperCode: string;
  subjectName: string;
  subjectCode: string;
  sourcePath: string;
  sourceDetails: SourceDetails[];
  studentErrors: StudentErrors[];
}

interface SourcesTableProps {
  sources: Sources;
  columns: ColumnDef<SourceDetails>[];
  columnsError: ColumnDef<StudentErrors>[];
}

const SourcesTable: React.FC<SourcesTableProps> = ({ sources, columns, columnsError }) => {
  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow-none mt-4">
      <CardHeader className="flex flex-col space-y-1.5 p-6 pb-4">
        <CardTitle className="text-xl font-semibold">Sources Information</CardTitle>
        <CardDescription>
          This is information about the sources.
        </CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="mb-2">
            <p className="font-semibold text-md">Exam Code</p>
            <p className="text-sm text-muted-foreground">{sources.examCode}</p>
          </div>
          <div className="mb-2">
            <p className="font-semibold text-md">Subject Code</p>
            <p className="text-sm text-muted-foreground">{sources.subjectCode}</p>
          </div>
          <div className="mb-2">
            <p className="font-semibold text-md">Source Path</p>
            <p className="text-sm text-muted-foreground">
              {sources.sourcePath}
            </p>
          </div>
          <div className="mb-2">
            <p className="font-semibold text-md">Exam Paper Code</p>
            <p className="text-sm text-muted-foreground">
              {sources.examPaperCode}
            </p>
          </div>
          <div className="mb-2">
            <p className="font-semibold text-md">Subject Name</p>
            <p className="text-sm text-muted-foreground">
              {sources.subjectName}
            </p>
          </div>
          <div className="mb-2">
            <p className="font-semibold text-md">Total Sources</p>
            <p className="text-sm text-muted-foreground">
              {sources.sourceDetails.length}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 pt-0">
        <CardTitle className="text-xl font-semibold pt-6">Source Details</CardTitle>
        <CardDescription>
          This is a list of sources.
        </CardDescription>
        <DataTable columns={columns} data={sources.sourceDetails} />
      </CardContent>
      <Separator />
      <CardContent className="p-6 pt-0">
        <CardTitle className="text-xl font-semibold pt-6">Source Errors</CardTitle>
        <CardDescription>
          This is a list of student sources with errors.
        </CardDescription>
        <DataTableError columns={columnsError} data={sources.studentErrors} />
      </CardContent>
      <Separator className="h-2 rounded-b-xl bg-primary"/>
    </Card>
  );
};

export default SourcesTable;
