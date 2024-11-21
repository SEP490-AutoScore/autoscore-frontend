import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExamPaperInfo } from "././exam-paper-info";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useHeader } from "@/hooks/use-header";
import ExamQuestionsList from "./exam-questions";

interface ExamPaper {
    examPaperId: number;
    examPaperCode: string;
    importants: any[];
    isUsed: boolean;
    status: string;
    instruction: string;
    duration: number;
}

export default function ExamPaperDetails() {
    const location = useLocation();
    const { examId, examPaperId } = location.state || {};

    const [examPaper, setExamPaper] = useState<ExamPaper | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const Header = useHeader({
        breadcrumbLink: "/exams",
        breadcrumbPage: "Exams Overview",
        breadcrumbLink_2: `/exams/exam-papers`,
        breadcrumbPage_2: "Exam Details",
        breadcrumbPage_3: "Exam Question",
        stateGive: { examId: examId }, // only pass if state is required
      });


    useEffect(() => {
        if (!examPaperId) return;

        const token = localStorage.getItem("jwtToken");
        fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch exam paper details");
                }
                return response.json();
            })
            .then((data) => setExamPaper(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [examPaperId]);

    if (!examId || !examPaperId) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Missing required information. Please go back.</AlertDescription>
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
            <div className="space-y-6 p-6">
                {examPaper && <ExamPaperInfo examPaper={examPaper} />}
            </div>
            <div className="space-y-6 p-6">
                <ExamQuestionsList examPaperId={examPaperId} />
            </div>
        </>
    );
}
