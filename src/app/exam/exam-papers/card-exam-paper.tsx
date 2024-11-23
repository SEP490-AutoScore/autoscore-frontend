import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
                                    View Gherkin-Postman
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        navigate("/exams/exam-papers/postman-for-grading", {
                                            state: { examId, examPaperId: examPaper.examPaperId },
                                        })
                                    }
                                >
                                    View Postman-For-Grading
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
