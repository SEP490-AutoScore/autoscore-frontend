import { useState, useEffect } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import { ExamDetailContent } from "./exam-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { ExamPaperList } from "./exam-papers-list";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Students from "@/app/exam/students/app-students";
import Sources from "@/app/exam/sources/app-sources";
import { useLocation } from "react-router-dom";

export default function ExamDetailPage() {
  const location = useLocation();
  const examId = location.state?.examId;
  const onReload = location.state?.onReload || false;
  const onSourceReload = location.state?.onSourceReload || false;
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

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
      <div className="mx-4">
        <div className="px-6">
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
              >
                Sources
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="p-6 pt-4">
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
          {activeTab === "students" && onReload && <Students />}
          {activeTab === "students" && !onReload && <Students />}
          {activeTab === "sources" && onSourceReload && <Sources />}
          {activeTab === "sources" && !onSourceReload && <Sources />}
        </div>
      </div>
    </SidebarInset>
  );
}
