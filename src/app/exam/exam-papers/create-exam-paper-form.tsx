import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Alert } from "@/components/ui/alert";

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

interface CreateExamPaperFormProps {
    examId: number;
    importants: Important[];
    onSuccess: (newExamPaper: any) => void;
    onError: (error: string) => void;
}

export function CreateExamPaperForm({
    examId,
    importants,
    onSuccess,
    onError,
}: CreateExamPaperFormProps) {
    const [formData, setFormData] = useState({
        examPaperCode: "",
        instruction: "",
        duration: "", // Duration field added here
        importantIdList: [] as number[],
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // State to track submission

    const handleFormSubmit = () => {
        const token = localStorage.getItem("jwtToken");

        // Validate duration is a number and greater than 0
        const duration = Number(formData.duration);
        if (!formData.examPaperCode || formData.importantIdList.length === 0 || duration <= 0 || isNaN(duration)) {
            setErrorMessage("Please fill all fields correctly.");
            onError("Please fill all fields correctly.");
            return;
        }

        fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                examPaperCode: formData.examPaperCode,
                examId,
                instruction: formData.instruction,
                duration, // Send the duration
                importantIdList: formData.importantIdList,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create exam paper");
                }
                return response.json();
            })
            .then((data) => {
                onSuccess(data);
                setIsSubmitted(true); // Mark as submitted
                setFormData({
                    examPaperCode: "",
                    instruction: "",
                    duration: "",
                    importantIdList: [],
                });
                setErrorMessage(null); // Reset error message
            })
            .catch((err) => {
                setErrorMessage(err.message);
                onError(err.message);
            });
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ensure only numbers are entered and strip out non-numeric characters
        const value = e.target.value.replace(/[^0-9]/g, "");
        setFormData((prevData) => ({
            ...prevData,
            duration: value,
        }));
    };

    if (isSubmitted) {
        return (
            <div className="text-center mt-8">
                <p className="text-xl font-semibold text-green-600">Exam Paper Created Successfully!</p>
            </div>
        );
    }

    return (
        <DialogContent className="p-8 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Create New Exam Paper</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    Fill in the details for the new exam paper.
                </DialogDescription>
            </DialogHeader>

            {/* Error Message */}
            {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                    <p>{errorMessage}</p>
                </Alert>
            )}

            <div className="space-y-6 mt-6">
                <div className="flex flex-col space-y-4">
                    <Input
                        placeholder="Exam Paper Code"
                        value={formData.examPaperCode}
                        onChange={(e) =>
                            setFormData({ ...formData, examPaperCode: e.target.value })
                        }
                        className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                    />
                    
                    {/* Instruction Textarea */}
                    <Textarea
                        placeholder="Instructions"
                        value={formData.instruction}
                        onChange={(e) =>
                            setFormData({ ...formData, instruction: e.target.value })
                        }
                        className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                        rows={4} // Allow multiple lines for instructions
                    />

                    {/* Duration Input */}
                    <Input
                        placeholder="Duration (minutes)"
                        value={formData.duration}
                        onChange={handleDurationChange} // Use the new handler
                        type="text" // Use text type to handle input sanitization
                        className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Important Notes Selection */}
                <div>
                    <strong className="block text-lg font-medium">Select Important Notes:</strong>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {importants.map((important) => (
                            <div
                                key={important.importantId}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    value={important.importantId}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        setFormData((prevData) => {
                                            const updatedList = e.target.checked
                                                ? [...prevData.importantIdList, id]
                                                : prevData.importantIdList.filter(
                                                      (item) => item !== id
                                                  );
                                            return { ...prevData, importantIdList: updatedList };
                                        });
                                    }}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                                />
                                <label className="text-sm">{important.importantName || important.subject.subjectName}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleFormSubmit}
                    variant="outline"
                    className="mt-4 w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-blue-400"
                >
                    Submit
                </Button>
            </div>
        </DialogContent>
    );
}
