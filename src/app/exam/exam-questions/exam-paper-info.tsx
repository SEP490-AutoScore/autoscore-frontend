import { Card, CardHeader } from "@/components/ui/card";
import UpdateExamPaper from "@/app/exam/exam-papers/update-exam-paper-form"

interface Subject {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
}

interface ExamPaper {
    examPaperId: number;
    examPaperCode: string;
    examId: number;
    subject: Subject; // Subject can be null
    duration: number | null; // Duration can be null
}

export function ExamPaperInfo({ examPaper }: { examPaper: ExamPaper }) {
    return (
        <Card className="border shadow-md">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    {/* Thông tin Exam Paper */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <div>
                            <p className="font-semibold">Exam Code:</p>
                            <p>{examPaper.examPaperCode || "N/A"}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Subject:</p>
                            <p>
                                {examPaper.subject
                                    ? `${examPaper.subject.subjectName || "N/A"} (${examPaper.subject.subjectCode || "N/A"})`
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold">Duration:</p>
                            <p>
                                {examPaper.duration !== null && examPaper.duration >= 0
                                    ? `${examPaper.duration} minutes`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                    {/* Nút UpdateExamPaper */}
                    <UpdateExamPaper
                        examPaperId={examPaper.examPaperId}
                        subjectId={examPaper.subject.subjectId}
                        examId={examPaper.examId}
                    />
                </div>
            </CardHeader>
        </Card>
    );
}
