import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/config/apiConfig";

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

export function CreateExamPaperForm({ examId, importants, onSuccess, onError }: CreateExamPaperFormProps) {
    const [formData, setFormData] = useState({
        examPaperCode: "",
        instruction: "",
        importantIdList: [] as number[],
    });

    const handleFormSubmit = () => {
        const token = localStorage.getItem("jwtToken");

        if (!formData.examPaperCode || formData.importantIdList.length === 0) {
            onError("Please fill all fields.");
            return;
        }

        fetch(`${BASE_URL}/api/exam-paper`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                examPaperCode: formData.examPaperCode,
                examId,
                instruction: formData.instruction,
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
                setFormData({
                    examPaperCode: "",
                    instruction: "",
                    importantIdList: [],
                });
            })
            .catch((err) => onError(err.message));
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Exam Paper</DialogTitle>
                <DialogDescription>
                    Fill in the details for the new exam paper.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
                <div className="flex flex-col space-y-2">
                    <Input
                        placeholder="Exam Paper Code"
                        value={formData.examPaperCode}
                        onChange={(e) => setFormData({ ...formData, examPaperCode: e.target.value })}
                    />
                    <Input
                        placeholder="Instructions"
                        value={formData.instruction}
                        onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                    />
                    <div>
                        <strong>Select Important Notes:</strong>
                        <div>
                            {importants.map((important) => (
                                <div key={important.importantId}>
                                    <label>
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
                                        />
                                        {important.importantName || important.subject.subjectName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Button onClick={handleFormSubmit} variant="outline">
                    Submit
                </Button>
            </div>
        </DialogContent>
    );
}
