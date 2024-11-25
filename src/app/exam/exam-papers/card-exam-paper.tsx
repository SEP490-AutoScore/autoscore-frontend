import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  NotebookText,
  SquareChartGantt,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";

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
    <Card key={examPaper.examPaperId}>
      <CardContent className="p-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex justify-between w-1/3">
            <div>
              <CardTitle className="text-md font-semibold">
                Exam Paper Code
              </CardTitle>
              <CardDescription>{examPaper.examPaperCode}</CardDescription>
            </div>
            <div>
              <CardTitle className="text-md font-semibold">Subject</CardTitle>
              <CardDescription>
                {/* {examPaper.importants[0].subject.subjectName ? `${examPaper.importants[0].subject.subjectName} (${examPaper.importants[0].subject.subjectCode})` : "N/A"} */}
                Subject
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
              title="View Paper Details"
              onClick={() =>
                navigate("/exams/exam-papers/exam-questions", {
                  state: { examId, examPaperId: examPaper.examPaperId },
                })
              }
            >
              <NotebookText />
            </Button>
            <Button
              className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
              title="View Gherkin Postman"
              onClick={() =>
                navigate("/exams/exam-papers/gherkin-postman", {
                  state: { examId, examPaperId: examPaper.examPaperId },
                })
              }
            >
              <SquareChartGantt />
            </Button>
            <Button
              className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
              title="View Postman Grading"
              onClick={() =>
                navigate("/exams/exam-papers/postman-for-grading", {
                  state: { examId, examPaperId: examPaper.examPaperId },
                })
              }
            >
              <Target />
            </Button>
            <Button
              className="p-4 h-10 w-10 border rounded-full border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors duration-200"
              title="Export Word"
              onClick={handleDownloadWord}
            >
              <Download />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
