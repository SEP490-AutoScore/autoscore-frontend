import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

export function ExamPaperCard({ examPaper, examId }: { examPaper: ExamPaper; examId: number }) {
    const navigate = useNavigate();

    return (
        <Card
            key={examPaper.examPaperId}
            className="w-full border shadow-md hover:shadow-lg"
        >
            <CardHeader>
                <CardTitle>{examPaper.examPaperCode}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <strong>Duration:</strong> {examPaper.duration}
                </div>
                <Button
                    variant="outline"
                    onClick={() =>
                        navigate("/exams/exam-papers/exam-questions", {
                            state: { examId, examPaperId: examPaper.examPaperId },
                        })
                    }
                >
                    View Paper Details
                </Button>
            </CardContent>
        </Card>
    );
}
