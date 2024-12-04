import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface UpdateQuestionProps {
    examPaperId: number;
    questionId: number;
}

export default function UpdateQuestion({ examPaperId, questionId }: UpdateQuestionProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        questionContent: "",
        examQuestionScore: 0,
        endPoint: "",
        roleAllow: "",
        httpMethod: "",
        description: "",
        payloadType: "",
        payload: "",
        validation: "",
        sucessResponse: "",
        errorResponse: "",
        orderBy: 0,
        examPaperId,
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const showToast = useToastNotification();

    // Fetch question details when dialog opens
    useEffect(() => {
        if (!open) return;
        const token = localStorage.getItem("jwtToken");
        setLoading(true);

        fetch(`${BASE_URL}${API_ENDPOINTS.getQuestion}/${questionId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch question details");
                return response.json();
            })
            .then((data) => {
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                }));
            })
            .catch((err) => setErrorMessage(err.message))
            .finally(() => setLoading(false));
    }, [open, questionId]);

    const handleFormSubmit = () => {
        const token = localStorage.getItem("jwtToken");

        if (!formData.questionContent || formData.examQuestionScore <= 0) {
            setErrorMessage("Please fill all fields correctly.");
            return;
        }

        fetch(`${BASE_URL}${API_ENDPOINTS.getQuestion}/${questionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update question");
                }
                showToast({
                    title: "Update success",
                    description: "Question updated successfully.",
                    variant: "default",
                });
                setOpen(false);
            })
            .catch((err) => setErrorMessage(err.message));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="outline">
                Update Question
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[80vw] max-w-4xl h-[80vh] overflow-y-auto"> {/* Thiết lập chiều rộng và chiều cao */}
                    <DialogHeader>
                        <DialogTitle>Update Question</DialogTitle>
                        <DialogClose />
                    </DialogHeader>

                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            <p>{errorMessage}</p>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Question Content"
                            value={formData.questionContent}
                            onChange={(e) =>
                                setFormData({ ...formData, questionContent: e.target.value })
                            }
                            rows={4}
                        />
                        <Input
                            placeholder="Exam Question Score"
                            type="number"
                            value={formData.examQuestionScore}
                            onChange={(e) =>
                                setFormData({ ...formData, examQuestionScore: Number(e.target.value) })
                            }
                        />
                        <Input
                            placeholder="End Point"
                            value={formData.endPoint}
                            onChange={(e) =>
                                setFormData({ ...formData, endPoint: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Role Allow"
                            value={formData.roleAllow}
                            onChange={(e) =>
                                setFormData({ ...formData, roleAllow: e.target.value })
                            }
                        />
                        <Input
                            placeholder="HTTP Method"
                            value={formData.httpMethod}
                            onChange={(e) =>
                                setFormData({ ...formData, httpMethod: e.target.value })
                            }
                        />
                        <Textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                        <Input
                            placeholder="Payload Type"
                            value={formData.payloadType}
                            onChange={(e) =>
                                setFormData({ ...formData, payloadType: e.target.value })
                            }
                        />
                        <Textarea
                            placeholder="Payload"
                            value={formData.payload}
                            onChange={(e) =>
                                setFormData({ ...formData, payload: e.target.value })
                            }
                            rows={3}
                        />
                        <Textarea
                            placeholder="Validation"
                            value={formData.validation}
                            onChange={(e) =>
                                setFormData({ ...formData, validation: e.target.value })
                            }
                            rows={3}
                        />
                        <Textarea
                            placeholder="Success Response"
                            value={formData.sucessResponse}
                            onChange={(e) =>
                                setFormData({ ...formData, sucessResponse: e.target.value })
                            }
                            rows={3}
                        />
                        <Textarea
                            placeholder="Error Response"
                            value={formData.errorResponse}
                            onChange={(e) =>
                                setFormData({ ...formData, errorResponse: e.target.value })
                            }
                            rows={3}
                        />
                        <Input
                            placeholder="Order By"
                            type="number"
                            value={formData.orderBy}
                            onChange={(e) =>
                                setFormData({ ...formData, orderBy: Number(e.target.value) })
                            }
                        />

                        <Button onClick={handleFormSubmit} variant="outline" className="w-full py-2">
                            Update
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
