import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useNavigate } from "react-router-dom";
import { MousePointerClick } from "lucide-react";

// Define the type for exam papers
interface ExamPaper {
    examPaperId: number;
    examPaperCode: string;
    examId: number;
    isUsed: boolean;
    status: string;
    instruction: string;
    duration: number;
}

// Define props type
interface ExamPaperDialogProps {
    examId: number;
}

const ExamPaperDialog: React.FC<ExamPaperDialogProps> = ({ examId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);
    const [selectedExamPaperId, setSelectedExamPaperId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("jwtToken");
    const showToast = useToastNotification();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchExamPapers();
        }
    }, [isOpen]);

    const fetchExamPapers = async () => {
        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch exam papers.");
            }
            const data: ExamPaper[] = await response.json();
            setExamPapers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssignExamPaper = async () => {
        if (!selectedExamPaperId) {
            showToast({
                title: "Exam Paper",
                description: "Please select an exam paper.",
                variant: "default",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/exam-paper`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    examPaperId: selectedExamPaperId,
                    examId: examId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to assign exam paper.");
            }

            showToast({
                title: "Exam Paper",
                description: "Exam paper assigned successfully.",
                variant: "default",
            });
            navigate(0);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            showToast({
                title: "Exam Paper",
                description: "Failed to assign exam paper. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                <Button
                    variant="outline"
                    className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
                  >
                    <MousePointerClick />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Exam Paper</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        {examPapers.length > 0 ? (
                            <ul className="divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white shadow-sm">
                                {examPapers.map((examPaper) => (
                                    <li key={examPaper.examPaperId} className="flex items-center p-4 hover:bg-gray-50">
                                        <label className="flex items-center w-full cursor-pointer">
                                            <input
                                                type="radio"
                                                name="examPaper"
                                                value={examPaper.examPaperId}
                                                onChange={() => setSelectedExamPaperId(examPaper.examPaperId)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-900">{examPaper.examPaperCode}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
                                <p className="text-gray-500">No exam papers available.</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsOpen(false)} variant="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleAssignExamPaper} disabled={loading}>
                            {loading ? "Assigning..." : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExamPaperDialog;
