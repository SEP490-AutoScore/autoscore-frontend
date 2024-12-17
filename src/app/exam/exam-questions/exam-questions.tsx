import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import ExamQuestionItem from "./exam-question-info";
import ImportQuestion from "@/app/exam/exam-questions/import-question";
import CreateQuestion from "@/app/exam/exam-questions/create-question-form";
import { Separator } from "@/components/ui/separator";
import { CardHeader } from "@/components/ui/card";

interface ExamQuestion {
  examQuestionId: number;
  questionContent: string;
  examQuestionScore: number;
  endPoint: string;
  roleAllow: string;
  httpMethod: string;
  description: string;
  payloadType: string | null;
  payload: string | null;
  validation: string | null;
  sucessResponse: string | null;
  errorResponse: string | null;
  orderBy: number;
  examPaperId: number;
}

interface ExamQuestionsListProps {
  examPaperId: number;
}

const ExamQuestionsList: React.FC<ExamQuestionsListProps> = ({
  examPaperId,
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    fetch(`${BASE_URL}${API_ENDPOINTS.getQuestions}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ examPaperId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch exam questions.");
        if (response.status === 204) return [];
        return response.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [examPaperId]);

  const toggleExpand = (id: number) => {
    setExpandedQuestionId((prevId) => (prevId === id ? null : id));
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
    </div>
  );

  const renderErrorState = () => (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  const renderNoQuestionsState = () => (
    <div className="space-y-4">
        <div className="mx-4">
          <Separator className="h-1 bg-primary rounded" />
        </div>
      <div className="flex justify-end">
        <div className="flex space-x-4">
          <CreateQuestion examPaperId={examPaperId} />
          <ImportQuestion examPaperId={examPaperId} />
        </div>
      </div>
      <Alert variant="default">
        <AlertTitle>No Questions Found</AlertTitle>
        <AlertDescription>This exam paper has no questions.</AlertDescription>
      </Alert>
    </div>
  );

  const renderQuestionsList = () => (
    <div className="space-y-4 mx-2">
      <div className="mx-4">
        <Separator className="h-1 bg-primary rounded" />
      </div>
      <CardHeader className="font-semibold text-2xl p-4">
        <div className="flex justify-between items-center">
          Questions
          <div className="space-x-2 flex">
            <CreateQuestion examPaperId={examPaperId} />
            <ImportQuestion examPaperId={examPaperId} />
          </div>
        </div>
      </CardHeader>
      {questions.map((question) => (
        <div key={question.examQuestionId}>
          <ExamQuestionItem
            question={question}
            examPaperId={examPaperId}
            isExpanded={expandedQuestionId === question.examQuestionId}
            onToggle={() => toggleExpand(question.examQuestionId)}
          />
        </div>
      ))}
    </div>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (questions.length === 0) return renderNoQuestionsState();
  return renderQuestionsList();
};

export default ExamQuestionsList;
