import { useLocation } from "react-router-dom"; // Import useLocation để lấy state từ Link
import { useHeader } from "@/hooks/use-header";
import ExamQuestionsList from "@/app/exam/exam-questions/exam-questions";
import InfoComponent from "@/app/exam/exam-questions/instruction";
import Database from "@/app/exam/exam-questions/exam-database";
import { Card, CardHeader } from "@/components/ui/card";

export default function ExamDetailPage() {
    const location = useLocation(); // Dùng useLocation để lấy state
    const examPaperId = location.state?.examPaperId; // Lấy examId từ state nếu có
    const examPaperCode = location.state?.examPaperCode; // Lấy examId từ state nếu có

    const Header = useHeader({
        breadcrumbLink: "/exam-papers",
        breadcrumbPage: "Exam Papers",
        breadcrumbPage_2: "Exam Details",
    });

    // Main content
    return (
        <>
            {Header}
            <div className="px-4 pb-4">
                <div className="border border-gray-200 p-8 rounded-lg mx-4">
                    <div className="my-5">
                        <h2 className="text-2xl font-bold tracking-tight">Exams Paper</h2>
                        <p className="text-muted-foreground">
                            Here is a exam paper with details.
                        </p>
                    </div>
                    <Card className="bg-white shadow-md rounded-lg border border-gray-200">
                        <CardHeader className="font-semibold p-4">
                            <div>Exam Paper Code: {examPaperCode}</div>
                        </CardHeader>

                        <div className="space-y-6 p-6">
                            <InfoComponent examPaperId={examPaperId} />
                        </div>
                        <div className="space-y-6 p-6">
                            <Database examPaperId={examPaperId} />
                        </div>
                        <div className="space-y-6 p-6">
                            <ExamQuestionsList examPaperId={examPaperId} />
                        </div>
                    </Card>
                </div>

            </div>
        </>
    );
}
