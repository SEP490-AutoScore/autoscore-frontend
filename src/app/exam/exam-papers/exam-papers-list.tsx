import { useState, useEffect } from "react";
import { ExamPaperCard } from "./card-exam-paper";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateExamPaperForm } from "./create-exam-paper-form"; // Adjust the import path


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
    duration: string; // Add this field
    importants: Important[];
}

export function ExamPaperList({ examId }: { examId: number }) {
    const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [importants, setImportants] = useState<Important[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        fetch(`${BASE_URL}/api/important?subjectId=1`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch important items");
                }
                return response.json();
            })
            .then((data) => setImportants(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("jwtToken");

        fetch(`${BASE_URL}${API_ENDPOINTS.getExamPapers}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ examId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch exam papers");
                }
                if (response.status === 204) {
                    return [];
                }
                return response.json();
            })
            .then((data) => setExamPapers(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [examId]);

    const handleFormSuccess = (newExamPaper: any) => {
        setExamPapers((prevPapers) => [...prevPapers, newExamPaper]);
        setError(null);
    };

    const handleFormError = (errorMessage: string) => {
        setError(errorMessage);
    };

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
        <div className="space-y-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4">
                        Create New Exam Paper
                    </Button>
                </DialogTrigger>
                <CreateExamPaperForm
                    examId={examId}
                    importants={importants}
                    onSuccess={handleFormSuccess}
                    onError={handleFormError}
                />
            </Dialog>

            {examPapers.length === 0 ? (
                <p>No exam papers found for this exam.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {examPapers.map((examPaper) => (
                        <ExamPaperCard key={examPaper.examPaperId} examPaper={examPaper} examId={examId} />
                    ))}
                </div>
            )}
        </div>
    );
}
