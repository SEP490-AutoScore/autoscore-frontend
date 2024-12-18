import { useState, useEffect } from "react";
import { ExamPaperCard } from "./card-exam-paper";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { CreateExamPaperForm } from "./create-exam-paper-form"; // Adjust the import path
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NoResultPage } from "@/app/authentication/error/page";
import PickExamPaper from "@/app/exam/exam-papers/pick-exam-paper";

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

interface Subject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
}

interface ExamPaper {
  examPaperId: number;
  examPaperCode: string;
  subject: Subject;
  duration: string; // Add this field
  importants: Important[];
}

export function ExamPaperList({
  examId,
  subjectId,
}: {
  examId: number;
  subjectId: number;
}) {
  const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [importants, setImportants] = useState<Important[]>([]);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetch(`${BASE_URL}${API_ENDPOINTS.getImportant}?subjectId=${subjectId}`, {
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
        if (response.status === 204) {
          return [];
        }
        return response.json();
      })
      .then((data) => setImportants(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    setLoading(true);
    setError(null);

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
  }, [examId, token]);

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
    <>
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Exam Papers</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              This is a list of all the exam papers in this exam.
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <CreateExamPaperForm
              examId={examId}
              importants={importants}
              subjectId={subjectId}
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
            <PickExamPaper examId={examId} />
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {examPapers.length === 0 ? (
            <NoResultPage />
          ) : (
            <div className=" mt-6">
              {examPapers.map((examPaper) => (
                <ExamPaperCard
                  key={examPaper.examPaperId}
                  examPaper={examPaper}
                  examId={examId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
