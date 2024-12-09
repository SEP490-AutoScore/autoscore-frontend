import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation để lấy state từ Link
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import { ExamDetailContent } from "./exam-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { ExamPaperList } from "./exam-papers-list";

export default function ExamDetailPage() {
  const location = useLocation(); // Dùng useLocation để lấy state
  const examId = location.state?.examId; // Lấy examId từ state nếu có
  const [examData, setExamData] = useState<any>(null); // To store fetched exam data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbLink_2: examId ? `/exams/${examId}` : "/exams",
    breadcrumbPage_2: "Exam Details",
  });

  // Fetch exam data
  useEffect(() => {
    if (!examId) {
      setError("Exam ID is required");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwtToken");

    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}${API_ENDPOINTS.getExamInfo}/${examId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch exam details");
        }
        return response.json();
      })
      .then((data) => setExamData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [examId]);

  // Loading state
  if (loading) {
    return (
      <SidebarInset>
        {Header}
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </SidebarInset>
    );
  }

  // Error state
  if (error) {
    return (
      <SidebarInset>
        {Header}
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  // Main content
  return (
    <SidebarInset>
      {Header}
      <div className="p-4 border border-gray-200 rounded-lg mx-4">
        <div className="p-6">
          <ExamDetailContent examData={examData} />
        </div>
        <div className="p-6">
        <ExamPaperList examId={examId} subjectId={examData?.subject.subjectId} />
        </div>
      </div>
    </SidebarInset>
  );
}
