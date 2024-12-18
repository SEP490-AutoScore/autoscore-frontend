import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation để lấy state từ Link
import { useHeader } from "@/hooks/use-header";
import ExamQuestionsList from "@/app/exam/exam-questions/exam-questions";
import InfoComponent from "@/app/exam/exam-questions/instruction";
import Database from "@/app/exam/exam-questions/exam-database";
import { Card, CardHeader } from "@/components/ui/card";
import CompleteExamPaper from "@/app/exam/exam-questions/complete-exam-paper"
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import UpdateExamPaper from "../exam-papers/update-exam-paper-form";

// Define the interface for ExamPaper
interface Subject {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
}

interface Important {
    id: number;
    description: string;
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

export default function ExamDetailPage() {
    const location = useLocation(); // Dùng useLocation để lấy state
    const examPaperId = location.state?.examPaperId; // Lấy examId từ state nếu có
    const examPaperCode = location.state?.examPaperCode; // Lấy examId từ state nếu có
    const token = localStorage.getItem("jwtToken");

    const Header = useHeader({
        breadcrumbLink: "/exam-papers",
        breadcrumbPage: "Exam Papers",
        breadcrumbPage_2: "Exam Details",
    });

    const [examPaper, setExamPaper] = useState<ExamPaper | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch exam paper details
    useEffect(() => {
        const fetchExamPaperDetails = async () => {
            if (!examPaperId || !token) {
                setError("Missing examPaperId or token");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch exam paper details");
                }

                const data: ExamPaper = await response.json();
                setExamPaper(data);
            } catch (err) {
                setError("Error fetching exam paper details");
            } finally {
                setLoading(false);
            }
        };

        fetchExamPaperDetails();
    }, [examPaperId, token]);

    if (loading) {
        return <div>Loading exam paper details...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    // Main content
    return (
        <>
            {Header}
            <div className="px-4 pb-4">
                <div className="border border-gray-200 p-8 rounded-lg mx-4">
                    <div className="my-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Exams Paper</h2>
                                <p className="text-muted-foreground">Here is a exam paper with details.</p>
                            </div>
                            <div className="flex space-x-2">
                                <CompleteExamPaper examPaperId={examPaperId} examPaperStatus={examPaper?.status} />
                                <UpdateExamPaper
                                    examPaperId={examPaperId}
                                    subjectId={examPaper!.subject.subjectId}
                                    examId={0}
                                    examPaperStatus={examPaper?.status}
                                />
                            </div>
                        </div>

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
