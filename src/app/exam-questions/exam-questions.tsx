import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import ExamQuestionItem from "./exam-question-info";
import CreateQuestionForm from "./create-question-form";
import { Button } from "@/components/ui/button";

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
}

interface ExamQuestionsListProps {
    examPaperId: number;
}

const ExamQuestionsList: React.FC<ExamQuestionsListProps> = ({ examPaperId }) => {
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        setExpandedQuestionId(prevId => (prevId === id ? null : id));
    };

    const handleCreateQuestion = (newQuestionData: any) => {
        const token = localStorage.getItem("jwtToken");

        const requestBody = { ...newQuestionData, examPaperId };

        fetch(`${BASE_URL}/api/exam-question`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to create new question.");
                return response.json();
            })
            .then((data) => {
                setQuestions(prevQuestions => [...prevQuestions, data]);
                setSuccessMessage("Question created successfully!");
                setShowCreateForm(false);
            })
            .catch((err) => setError(err.message));
    };

    const toggleFormVisibility = () => setShowCreateForm(prevState => !prevState);

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
        <>
            <Button onClick={toggleFormVisibility} className="w-full">
                {showCreateForm ? "Cancel" : "Create New Question"}
            </Button>
            {showCreateForm && <CreateQuestionForm onCreate={handleCreateQuestion} />}
            {successMessage && (
                <Alert variant="default">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}
            <Alert variant="default">
                <AlertTitle>No Questions Found</AlertTitle>
                <AlertDescription>This exam paper has no questions.</AlertDescription>
            </Alert>
        </>
    );

    const renderQuestionsList = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button onClick={toggleFormVisibility} className="w-full">
                {showCreateForm ? "Cancel" : "Create New Question"}
            </Button>
            {showCreateForm && <CreateQuestionForm onCreate={handleCreateQuestion} />}
            {successMessage && (
                <Alert variant="default">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}
            {questions.map((question) => (
                <ExamQuestionItem
                    key={question.examQuestionId}
                    question={question}
                    isExpanded={expandedQuestionId === question.examQuestionId}
                    onToggle={() => toggleExpand(question.examQuestionId)}
                />
            ))}
        </div>
    );

    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (questions.length === 0) return renderNoQuestionsState();
    return renderQuestionsList();
};

export default ExamQuestionsList;
