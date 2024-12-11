import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface UpdateQuestionProps {
    examPaperId: number;
    questionId: number;
}

const defaultFormData = (examPaperId: number) => ({
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
    examPaperId: examPaperId,
});

export default function UpdateQuestion({ examPaperId, questionId }: UpdateQuestionProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(defaultFormData(examPaperId));
    const [, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const showToast = useToastNotification();

    const token = localStorage.getItem("jwtToken");

    // Fetch question details when dialog opens
    useEffect(() => {
        if (!open) return;

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
            .then((data) => setFormData((prev) => ({ ...prev, ...data })))
            .catch((err) => setErrorMessage(err.message))
            .finally(() => setLoading(false));
    }, [open, questionId, token]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFormSubmit = () => {
        if (!formData.questionContent || formData.examQuestionScore <= 0) {
            setErrorMessage("Please fill in all fields correctly.");
            return;
        }

        if (!["JSON", "URL Parameter"].includes(formData.payloadType || "")) {
            setErrorMessage("Invalid Payload Type selected.");
            return;
        }

        if (!["GET", "POST", "PUT", "DELETE"].includes(formData.httpMethod)) {
            setErrorMessage("Invalid HTTP Method selected.");
            return;
        }

        setSubmitting(true);

        const payload = { ...formData, examPaperId };

        fetch(`${BASE_URL}${API_ENDPOINTS.getQuestion}/${questionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update question");
                showToast({
                    title: "Update Success",
                    description: "Question updated successfully.",
                    variant: "default",
                });
                setOpen(false);
            })
            .catch((err) => setErrorMessage(err.message))
            .finally(() => setSubmitting(false));
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="outline">
                Update Question
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[80vw] max-w-4xl h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Question</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    {loading ? (
                        <div className="text-center">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Question Content"
                                value={formData.questionContent}
                                onChange={(e) => handleInputChange("questionContent", e.target.value)}
                                rows={4}
                            />

                            {/* Score and Role Allow in the Same Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="examQuestionScore" className="block text-sm font-medium text-gray-700">
                                        Exam Question Score
                                    </label>
                                    <Input
                                        id="examQuestionScore"
                                        placeholder="Exam Question Score"
                                        type="number"
                                        value={formData.examQuestionScore}
                                        onChange={(e) => handleInputChange("examQuestionScore", Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="roleAllow" className="block text-sm font-medium text-gray-700">
                                        Role Allow
                                    </label>
                                    <Input
                                        id="roleAllow"
                                        placeholder="Role Allow"
                                        value={formData.roleAllow}
                                        onChange={(e) => handleInputChange("roleAllow", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* HTTP Method and End Point in the Same Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="httpMethod" className="block text-sm font-medium text-gray-700">
                                        HTTP Method
                                    </label>
                                    <select
                                        id="httpMethod"
                                        value={formData.httpMethod}
                                        onChange={(e) => handleInputChange("httpMethod", e.target.value)}
                                        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select HTTP Method</option>
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="endPoint" className="block text-sm font-medium text-gray-700">
                                        End Point
                                    </label>
                                    <Input
                                        id="endPoint"
                                        placeholder="End Point"
                                        value={formData.endPoint}
                                        onChange={(e) => handleInputChange("endPoint", e.target.value)}
                                    />
                                </div>
                            </div>

                            <Textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                rows={3}
                            />

                            {/* Payload Type */}
                            <div>
                                <label htmlFor="payloadType" className="block text-sm font-medium text-gray-700">
                                    Payload Type
                                </label>
                                <select
                                    id="payloadType"
                                    value={formData.payloadType || ""}
                                    onChange={(e) => handleInputChange("payloadType", e.target.value)}
                                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Type</option>
                                    <option value="JSON">JSON</option>
                                    <option value="URL Parameter">URL Parameter</option>
                                </select>
                            </div>

                            <Textarea
                                placeholder="Payload"
                                value={formData.payload}
                                onChange={(e) => handleInputChange("payload", e.target.value)}
                                rows={3}
                            />
                            <Textarea
                                placeholder="Validation"
                                value={formData.validation}
                                onChange={(e) => handleInputChange("validation", e.target.value)}
                                rows={3}
                            />
                            <Textarea
                                placeholder="Success Response"
                                value={formData.sucessResponse}
                                onChange={(e) => handleInputChange("sucessResponse", e.target.value)}
                                rows={3}
                            />
                            <Textarea
                                placeholder="Error Response"
                                value={formData.errorResponse}
                                onChange={(e) => handleInputChange("errorResponse", e.target.value)}
                                rows={3}
                            />

                            <Button
                                onClick={handleFormSubmit}
                                variant="outline"
                                className="w-full py-2"
                                disabled={submitting}
                            >
                                {submitting ? "Updating..." : "Update"}
                            </Button>
                        </div>

                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
