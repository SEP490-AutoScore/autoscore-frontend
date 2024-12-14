import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Alert } from "@/components/ui/alert";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

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
    subjectId: number;
    onSuccess: (newExamPaper: any) => void;
    onError: (error: string) => void;
}

export function CreateExamPaperForm({
    examId,
    importants,
    subjectId,
    onSuccess,
    onError,
}: CreateExamPaperFormProps) {
    const [formData, setFormData] = useState({
        examPaperCode: "",
        instruction: "",
        duration: "",
        importantIdList: [] as number[],
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const showToast = useToastNotification();
    const token = useMemo(() => localStorage.getItem("jwtToken"), []);

    const handleInputChange = (key: string, value: string | number) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
        setErrorMessage(null); // Clear error message on input change
    };

    const handleFormSubmit = () => {
        // Validate fields
        const duration = Number(formData.duration);
        if (!formData.examPaperCode || formData.importantIdList.length === 0 || duration <= 0 || isNaN(duration)) {
            return;
        }

        setIsLoading(true);
        fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                examPaperCode: formData.examPaperCode,
                examId,
                subjectId,
                instruction: formData.instruction,
                duration,
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
                showToast({
                    title: "Create success",
                    description: "Create new exam paper success",
                    variant: "default",
                });
                setIsDialogOpen(false); // Close the dialog
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="p-8 bg-white shadow-lg rounded-lg max-w-xl mx-auto h-[80vh] flex flex-col">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Create Exam Paper</h2>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <Alert variant="destructive" className="mb-4 flex items-center">
                        <span className="mr-2 text-red-500">⚠️</span>
                        <p>{errorMessage}</p>
                    </Alert>
                )}

                <div className="space-y-6 flex-grow overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        <Input
                            placeholder="Exam Paper Code"
                            value={formData.examPaperCode}
                            onChange={(e) => handleInputChange("examPaperCode", e.target.value)}
                            className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                        />

                        <Textarea
                            placeholder="Instructions"
                            value={formData.instruction}
                            onChange={(e) => handleInputChange("instruction", e.target.value)}
                            className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                            rows={4}
                        />

                        <Input
                            placeholder="Duration (minutes)"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                            type="number"
                            min={1}
                            className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <strong className="block text-lg font-medium">Select Important Notes:</strong>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {importants.map((important) => (
                            <div key={important.importantId} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={important.importantId}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        setFormData((prevData) => {
                                            const updatedList = e.target.checked
                                                ? [...prevData.importantIdList, id]
                                                : prevData.importantIdList.filter((item) => item !== id);
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

                {/* Button luôn sát dưới */}
                <Button
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                    variant="outline"
                    className="mt-4 w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-blue-400"
                >
                    {isLoading ? "Createing..." : "Create new Exam Paper"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
