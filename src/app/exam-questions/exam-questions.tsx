import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import ExamQuestionItem from "./exam-question-info";
import CreateQuestionForm from "./create-question-form"; // Import CreateQuestionForm
import { Button } from "@/components/ui/button"; // Import Button from ShadCN UI

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
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // State to control form visibility
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

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
                if (!response.ok) {
                    throw new Error("Failed to fetch exam questions.");
                }
                return response.json();
            })
            .then((data) => setQuestions(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [examPaperId]);

    const toggleExpand = (id: number) => {
        setExpandedQuestionId((prevId) => (prevId === id ? null : id));
    };

    const handleCreateQuestion = (newQuestionData: any) => {
        const token = localStorage.getItem("jwtToken");

        // Request body for creating a new question
        const requestBody = {
            ...newQuestionData,
            examPaperId, // Include the exam paper ID
        };

        fetch(`${BASE_URL}/api/exam-question`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create new question.");
                }
                return response.json();
            })
            .then((data) => {
                // Assuming the API returns the newly created question
                setQuestions((prevQuestions) => [...prevQuestions, data]);
                setSuccessMessage("Question created successfully!"); // Set success message
                setShowCreateForm(false); // Hide the form after successful creation
            })
            .catch((err) => setError(err.message));
    };

    const handleToggleForm = () => {
        setShowCreateForm(!showCreateForm); // Toggle form visibility
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
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

    if (questions.length === 0) {
        return (
            <Alert variant="default">
                <AlertTitle>No Questions Found</AlertTitle>
                <AlertDescription>This exam paper has no questions.</AlertDescription>
            </Alert>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Questions</h2>

                {/* Button to toggle the form */}
                <Button onClick={handleToggleForm} className="w-full">
                    {showCreateForm ? "Cancel" : "Create New Question"}
                </Button>

                {/* Show the CreateQuestionForm if showCreateForm is true */}
                {showCreateForm && <CreateQuestionForm onCreate={handleCreateQuestion} />}

                {/* Success message */}
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
        </>
    );
};

export default ExamQuestionsList;
