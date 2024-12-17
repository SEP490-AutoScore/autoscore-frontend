import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExamPaperInfo } from "././exam-paper-info";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useHeader } from "@/hooks/use-header";
import ExamQuestionsList from "./exam-questions";
import InfoComponent from "./instruction";
import Database from "./exam-database";
import GradingProcess from "@/app/students/grading-process/grading-bar";
import Grading from "@/app/students/grading-exam/grading-exam-paper";
import { Card } from "@/components/ui/card";
import UpdateExamPaper from "../exam-papers/update-exam-paper-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ScorePage from "@/app/score/scores/scores";

interface Subject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
}

interface Semester {
  semesterId: number;
  semesterName: string;
  semesterCode: string;
}

interface Important {
  importantId: number;
  importantName: string;
  importantCode: string;
  importantScrip: string;
}

interface ExamPaper {
  examPaperId: number;
  examPaperCode: string;
  examId: number;
  importants: Important[];
  isUsed: boolean;
  status: string;
  instruction: string;
  duration: number;
  subject: Subject;
}

interface Exam {
  examId: number;
  examCode: string;
  examAt: string;
  gradingAt: string;
  publishAt: string;
  semester: Semester;
  subject: Subject;
  type: string;
  status: boolean;
}

export default function ExamPaperDetails() {
  const location = useLocation();
  const { examId, examPaperId } = location.state || {};
  const [examPaper, setExamPaper] = useState<ExamPaper>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const onGradingReload = location.state?.onGradingReload || false;
  const onScoreReload = location.state?.onScoreReload || false;

  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbLink_2: `/exams/exam-papers`,
    breadcrumbPage_2: "Exam Details",
    breadcrumbPage_3: "Exam Papper detail",
    stateGive: { examId: examId }, // only pass if state is required
  });

  const getData = useCallback(async () => {
    if (!examId || !examPaperId) {
      setError("Missing examId or examPaperId");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("jwtToken");

    try {
      const [examPaperResponse, examResponse] = await Promise.all([
        fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${BASE_URL}${API_ENDPOINTS.getExamInfo}/${examId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!examPaperResponse.ok || !examResponse.ok) {
        throw new Error("Failed to fetch exam or exam paper details");
      }

      const examPaperData = await examPaperResponse.json();
      const examData = await examResponse.json();

      setExamPaper((prevExamPaper) => ({
        ...prevExamPaper,
        ...examPaperData,
      }));
      setExam((prevExam) => ({
        ...prevExam,
        ...examData,
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [examId, examPaperId]);

  useEffect(() => {
    if (examId && examPaperId) {
      getData();
    }
  }, [examId, examPaperId, getData]);

  const exportListScore = async () => {
    if (!examPaper) return;
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.exportScore}?exampaperid=${examPaper.examPaperId}`,
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
      link.download = `${examPaper.examPaperCode}_scores.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export scores. Please try again.");
    }
  };

  const handleDownload = async () => {
    if (!examPaper) return;
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.txtLog}/${examPaper.examPaperId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download the log files");
      }

      const blob = await response.blob();
      const link = document.createElement("a");

      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${examPaper.examPaperCode}_log_run.zip`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  console.log(MyComponent)

  // Handle loading and errors
  if (!examId || !examPaperId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Missing required information. Please go back.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {Header}
      <div className="px-4 pb-4">
        <div className="w-fit bg-gray-100 rounded-md p-1">
          <ToggleGroup
            type="single"
            size="sm"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value || "details")}
          >
            <ToggleGroupItem
              value="details"
              aria-label="Details"
              className="px-3"
            >
              Details
            </ToggleGroupItem>
            <ToggleGroupItem
              value="grading"
              aria-label="Grading"
              className="px-3"
            >
              Grading
            </ToggleGroupItem>
            <ToggleGroupItem
              value="scores"
              aria-label="Scores"
              className="px-3"
            >
              Scores
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="border border-gray-200 p-8 rounded-lg mx-4">
        {activeTab === "details" && (
          <div>
            <div className="flex items-center justify-between space-y-2 mb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Exams Paper
                </h2>
                <p className="text-muted-foreground">
                  Here is a exam paper with details.
                </p>
              </div>
              <div className="flex space-x-2">
                <Grading examPaperId={examPaperId} />
                <UpdateExamPaper
                  examPaperId={examPaperId}
                  subjectId={examPaper!.subject.subjectId}
                  examId={examId}
                />
              </div>
            </div>
            <Card>
              {examPaper && (
                <ExamPaperInfo examPaper={examPaper} exam={exam!} />
              )}
              {/* <GradingProcess examPaperId={examPaperId} /> */}
              <InfoComponent examPaperId={examPaperId} />
              <Database examPaperId={examPaperId} />
              <ExamQuestionsList examPaperId={examPaperId} />
            </Card>
          </div>
        )}
        {activeTab === "grading" && onGradingReload && (
          <GradingProcess examPaperId={examPaperId} />
        )}
        {activeTab === "grading" && !onGradingReload && (
          <GradingProcess examPaperId={examPaperId} />
        )}
        {activeTab === "scores" && onScoreReload && (
          <ScorePage
            exportListScore={exportListScore}
            exportLogRun={handleDownload}
            examId={examId}
            examPaperId={examPaperId}
          />
        )}
        {activeTab === "scores" && !onScoreReload && (
          <ScorePage
            exportListScore={exportListScore}
            exportLogRun={handleDownload}
            examId={examId}
            examPaperId={examPaperId}
          />
        )}
      </div>
    </>
  );
}
