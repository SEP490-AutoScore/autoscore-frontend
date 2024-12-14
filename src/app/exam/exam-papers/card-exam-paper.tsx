import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Download, NotebookText, SquareChartGantt, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface Important {
  importantId: number;
  importantName: string;
  importantCode: string;
  importantScrip: string | null;
  subject: {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
  };
}

interface ExamPaper {
  examPaperId: number;
  examPaperCode: string;
  subject: {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
  };
  duration: string; // Assuming this field exists
  importants: Important[];
}

export function ExamPaperCard({
  examPaper,
  examId,
}: {
  examPaper: ExamPaper;
  examId: number;
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const showToast = useToastNotification();

  const handleExportLog = async () => {
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.exportLog}?examPaperId=${examPaper.examPaperId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export log.");
      }

      // Debug header Content-Disposition
      const contentDisposition = response.headers.get("Content-Disposition");
      console.log("Content-Disposition header:", contentDisposition);

      const fileName = contentDisposition
        ?.split("filename=")[1]
        ?.replace(/"/g, "")
        ?.trim();

      console.log("Parsed filename:", fileName);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.download = fileName || "log.txt";

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting log:", error);
      showToast({
        title: "Error.",
        description: "Failed to export the log. Please try again later.",
        actionText: "OK",
        variant: "destructive",
      });
    }
  };
  const handleDownloadWord = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.exportWord}?examPaperId=${examPaper.examPaperId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download the Word file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ExamPaper_${examPaper.examPaperCode}.docx`; // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showToast({
        title: "Error.",
        description:
          "Exam paper are not complete to export. Please add Database, Question, Instruction, Important to export.",
        actionText: "OK",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-2.5">
      <Card
        key={examPaper.examPaperId}
        className="shadow-none hover:shadow-md cursor-pointer"

      >
        <CardContent className="p-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex justify-between w-1/3"
              onClick={() =>
                navigate("/exams/exam-papers/exam-questions", {
                  state: { examId, examPaperId: examPaper.examPaperId },
                })
              }>
              <div>
                <CardTitle className="text-md font-semibold">
                  Exam Paper Code
                </CardTitle>
                <CardDescription>{examPaper.examPaperCode}</CardDescription>
              </div>
              <div>
                <CardTitle className="text-md font-semibold">Subject</CardTitle>
                <CardDescription>
                  {examPaper.subject.subjectName}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
                      onClick={() =>
                        navigate("/exams/exam-papers/exam-questions", {
                          state: { examId, examPaperId: examPaper.examPaperId },
                        })
                      }
                    >
                      <NotebookText />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Paper Details</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
                    onClick={handleExportLog}
                  >
                    <Download />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Log</TooltipContent>
              </Tooltip>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
                      onClick={() =>
                        navigate("/exams/exam-papers/gherkin-postman", {
                          state: { examId, examPaperId: examPaper.examPaperId },
                        })
                      }
                    >
                      <SquareChartGantt />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Gherkin Postman</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
                      onClick={() =>
                        navigate("/exams/exam-papers/postman-for-grading", {
                          state: { examId, examPaperId: examPaper.examPaperId },
                        })
                      }
                    >
                      <Target />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Postman Grading</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
                      onClick={handleDownloadWord}
                    >
                      <Download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export Word</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
