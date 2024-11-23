import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            description: "Exam paper are not complete to export. Please add Database, Question, Instruction, Important to export.",
            actionText: "OK",
            variant: "destructive",
          });
    }
  };

  return (
    <Card
      key={examPaper.examPaperId}
      className="w-full border shadow-md hover:shadow-lg"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{examPaper.examPaperCode}</CardTitle>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-orange-500 hover:text-white transition-colors duration-200 cursor-pointer"
                  title="More actions"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="absolute right-0 top-[-50px] w-48 bg-white shadow-lg border rounded-md"
              >
                <DropdownMenuItem
                  onClick={() =>
                    navigate("/exams/exam-papers/exam-questions", {
                      state: { examId, examPaperId: examPaper.examPaperId },
                    })
                  }
                >
                  View Paper Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate("/exams/exam-papers/gherkin-postman", {
                      state: { examId, examPaperId: examPaper.examPaperId },
                    })
                  }
                >
                  View Gherkin Postman
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate("/exams/exam-papers/postman-for-grading", {
                      state: { examId, examPaperId: examPaper.examPaperId },
                    })
                  }
                >
                  View Postman Grading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadWord}>
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>Duration:</strong> {examPaper.duration}
        </div>
      </CardContent>
    </Card>
  );
}
