import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";

interface PostmanDialogProps {
    onClose: () => void;
    postmanId: number | null;
    storedQuestionId: number | null;
    fetchGherkinPostmanPairs: (questionId: number) => void;
}

interface PostmanData {
    postmanForGradingId: number;
    postmanFunctionName: string;
    totalPmTest: number;
    fileCollectionPostman: string;
    examPaperId: number;
    examQuestionId: number | null;
}

export const PostmanDialog: React.FC<PostmanDialogProps> = ({ postmanId, storedQuestionId, fetchGherkinPostmanPairs }) => {
    const [postmanData, setPostmanData] = useState<any | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const notify = useToastNotification();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!postmanId) return;
        const fetchPostmanData = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const token = localStorage.getItem("jwtToken");
                // Fetch Postman Data
                const postmanResponse = await fetch(
                    `${BASE_URL}${API_ENDPOINTS.getPostmanById}/${postmanId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!postmanResponse.ok) {
                    throw new Error("Failed to fetch Postman data");
                }
                const postmanData = await postmanResponse.json();
                setPostmanData(postmanData);
                // Fetch Questions
                const questionsResponse = await fetch(
                    `${BASE_URL}${API_ENDPOINTS.getQuestions}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ examPaperId: postmanData.examPaperId }),
                    }
                );
                if (!questionsResponse.ok) {
                    throw new Error("Failed to fetch questions");
                }
                const questionsData = await questionsResponse.json();
                setQuestions(questionsData);
            } catch (error) {
                setErrorMessage("Could not fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchPostmanData();
    }, [postmanId]);

    const handleQuestionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedQuestionId = parseInt(event.target.value, 10);
        const selectedQuestion = questions.find(
            (question) => question.examQuestionId === selectedQuestionId
        );
        if (selectedQuestion) {
            setPostmanData((prevData: PostmanData | null) => {
                if (!prevData) return null;
                return {
                    ...prevData,
                    examQuestionId: selectedQuestion.examQuestionId,
                };
            });
        }
    };

    const submitUpdate = async () => {
        if (!postmanData?.postmanForGradingId || !postmanData?.examQuestionId) {
            notify({
                title: "Validation Error",
                description: "Please select a valid question before submitting.",
                variant: "destructive",
            });
            return;
        }
        setLoading(true);
        setErrorMessage(null);
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.updateExamQuestion}/${postmanData.postmanForGradingId}/${postmanData.examQuestionId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to update exam question.");
            }
            notify({
                title: "Success",
                description: "Update Successfully",
                variant: "default",
            });
            // Check if `storedQuestionId` is not null and fetch data or reload the page
            if (storedQuestionId !== null) {
                await fetchGherkinPostmanPairs(storedQuestionId);
            } else {
                window.location.reload();
            }
        } catch (error: any) {
            notify({
                title: "Update Failed",
                description: error.message || "An error occurred while updating.",
                variant: "destructive",
            });
            setErrorMessage(error.message || "Could not update Exam Question");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="p-8 bg-white shadow-lg rounded-lg max-w-7xl mx-auto max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Postman Details</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    Information about the selected Postman script and associated questions.
                </DialogDescription>
            </DialogHeader>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : errorMessage ? (
                <Alert variant="destructive" className="mt-4">
                    {errorMessage}
                </Alert>
            ) : (
                <div className="space-y-4 mt-4">
                    {postmanData && (
                        <>
                            <p className="text-sm">
                                <strong>Function Name:</strong> {postmanData.postmanFunctionName}
                            </p>
                            <p className="text-sm">
                                <strong>Total Tests:</strong> {postmanData.totalPmTest}
                            </p>
                            <p className="text-sm">
                                <strong>Question Content:</strong>
                            </p>
                            {postmanData.examQuestionId === null && (
                                <p className="text-red-500 text-sm font-medium">
                                    Need to select a question.
                                </p>
                            )}
                            <select
                                value={postmanData.examQuestionId || ""}
                                onChange={handleQuestionChange}
                                className="w-full border border-gray-300 rounded-md p-2 "
                                disabled={postmanData.examQuestionId !== null}
                            >
                                <option value="" disabled>
                                    Select a question
                                </option>
                                {questions.map((question) => (
                                    <option key={question.examQuestionId} value={question.examQuestionId}>
                                        {question.questionContent}
                                    </option>
                                ))}
                            </select>
                            <CardContent >
                                <pre className="text-sm whitespace-pre-wrap bg-gray-200 p-2 rounded">
                                    {JSON.stringify(JSON.parse(postmanData.fileCollectionPostman), null, 2)}
                                </pre>
                            </CardContent>
                        </>
                    )}
                </div>
            )}
            <Button
                onClick={submitUpdate}
                disabled={isSubmitting}
                variant="outline"
                className="w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-400 mt-4"
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
        </DialogContent>
    );
};
export default PostmanDialog;
