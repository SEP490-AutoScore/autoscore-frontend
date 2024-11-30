import { useState, useEffect } from "react";
import SourcesTable, {
  Sources,
} from "@/app/exam/sources/data-table-sources";
import { columns } from "@/app/exam/sources/columns";
import { DataTableSkeleton } from "@/app/exam/sources/data-table-skeleton";
import { ErrorPage } from "@/app/authentication/error/page";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import FolderUploadPopover from "@/components/folder-upload";
import { useLocation } from "react-router-dom";
import { Upload } from "lucide-react";
import { columnsError } from "./columns-student-error";

async function getData(examId : number): Promise<Sources[]> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getSourcesByExamId}${examId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export default function Page() {
  const [data, setData] = useState<Sources[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // State để điều khiển modal
  const location = useLocation();
  const { examId } = location.state || {};

  useEffect(() => {
    getData(examId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [examId]);

  if (error) return <ErrorPage />;
  if (!data) return <DataTableSkeleton />;
  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sources</h2>
          <p className="text-muted-foreground">
            Here's list of sources in the exam!
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} variant={"outline"}>
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>
      {data.map((sources) => (
        <SourcesTable
          key={sources.examCode}
          sources={sources}
          columns={columns}
          columnsError={columnsError}
        />
      ))}
      {/* Hiển thị modal FileUpload */}
      {isUploadOpen && (
        <FolderUploadPopover
          onClose={() => setIsUploadOpen(false)}
          examId={examId}
        />
      )}
    </div>
  );
}
