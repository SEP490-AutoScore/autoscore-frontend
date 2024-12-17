import { useState, useEffect } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import { ExamDetailContent } from "./exam-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { ExamPaperList } from "./exam-papers-list";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import StudentsPage from "@/app/exam/students/app-students";
import Sources from "@/app/exam/sources/app-sources";
import { useLocation } from "react-router-dom";
import { Students } from "../students/columns";

async function getData(examId: number): Promise<Students[]> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.getAllStudents}?examId=${examId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch data: ${error}`);
  }

  const data: Students[] = await res.json();
  return data;
}

export default function ExamDetailPage() {
  const location = useLocation();
  const examId = location.state?.examId;
  const onReload = location.state?.onReload || false;
  const onSourceReload = location.state?.onSourceReload || false;
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [data, setData] = useState<Students[] | null>(null);

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

  const handleOnReload = () => {
    if (!examId) return;
    getData(examId)
      .then((fetchedData) => setData(fetchedData))
      .catch((err) => setError(err.message));
  };

  // Trigger reload when component mounts or relevant state changes
  useEffect(() => {
    handleOnReload();
  }, [onReload, onSourceReload]); // Gọi lại mỗi khi `onReload` hoặc `onSourceReload` thay đổi.

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
      <div className="mx-4">
        <div className="pb-4">
          <div className="w-fit bg-gray-100 rounded-md p-1">
            <ToggleGroup
              type="single"
              size="sm"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value || "overview")}
            >
              <ToggleGroupItem
                value="overview"
                aria-label="Overview"
                className="px-3"
              >
                Overview
              </ToggleGroupItem>
              <ToggleGroupItem
                value="students"
                aria-label="Students"
                className="px-3"
              >
                Students
              </ToggleGroupItem>
              <ToggleGroupItem
                value="sources"
                aria-label="Sources"
                className="px-3"
                disabled={data?.length === 0}
              >
                Sources
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="w-full border border-gray-200 p-8 rounded-lg">
          {activeTab === "overview" && (
            <div>
              <div>
                <ExamDetailContent examData={examData} />
              </div>
              <div className="pt-6">
                <ExamPaperList
                  examId={examId}
                  subjectId={examData?.subject.subjectId}
                />
              </div>
            </div>
          )}
          {activeTab === "students" && onReload && <StudentsPage />}
          {activeTab === "students" && !onReload && <StudentsPage />}
          {activeTab === "sources" && onSourceReload && <Sources />}
          {activeTab === "sources" && !onSourceReload && <Sources />}
        </div>
      </div>
    </SidebarInset>
  );
}