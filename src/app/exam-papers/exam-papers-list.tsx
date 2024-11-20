import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Input } from "@/components/ui/input"; // Import Input component from ShadCN UI
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components

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

interface ExamPaper {
    examPaperId: number;
    examPaperCode: string;
    importants: Important[];
}

export function ExamPaperList({ examId }: { examId: number }) {
    const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        examPaperCode: "",
        instruction: "",
        importantIdList: [] as number[], // This will store selected importantId values
    });

    const [importants, setImportants] = useState<Important[]>([]); // State to store the important items

    useEffect(() => {
        const token = localStorage.getItem("jwtToken"); // Retrieve the JWT token from localStorage
    
        fetch(`${BASE_URL}/api/important?subjectId=1`, {
            method: "GET", // Assuming it's a GET request
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Set the token in the Authorization header
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch important items");
                }
                return response.json();
            })
            .then((data) => setImportants(data))
            .catch((err) => setError(err.message)) // Updated to handle the error message directly
            .finally(() => setLoading(false)); // Ensure loading is set to false when the request is complete
    }, []);

    // Fetch exam papers
    useEffect(() => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("jwtToken");

        fetch(`${BASE_URL}${API_ENDPOINTS.getExamPapers}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ examId }), // Sending the examId in the body
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch exam papers");
                }
                return response.json();
            })
            .then((data) => setExamPapers(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [examId]);

    const handleFormSubmit = () => {
        const token = localStorage.getItem("jwtToken");

        fetch(`${BASE_URL}/api/exam-paper`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                examPaperCode: formData.examPaperCode,
                examId: examId,
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
            .then(() => {
                // Reload exam papers after successful creation
                setFormData({
                    examPaperCode: "",
                    instruction: "",
                    importantIdList: [],
                });
                // Trigger refetching of the exam papers
                setLoading(true);
                setError(null);
                fetch(`${BASE_URL}${API_ENDPOINTS.getExamPapers}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ examId }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to fetch exam papers");
                        }
                        return response.json();
                    })
                    .then((data) => setExamPapers(data))
                    .catch((err) => setError(err.message))
                    .finally(() => setLoading(false));
            })
            .catch((err) => setError(err.message));
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
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

    return (
        <div className="space-y-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4">
                        Create New Exam Paper
                    </Button>
                </DialogTrigger>

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
                                                        const id = Number(e.target.value); // Ensure this is a number
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
            </Dialog>

            {examPapers.length === 0 ? (
                <p>No exam papers found for this exam.</p>
            ) : (
                examPapers.map((examPaper) => (
                    <Card key={examPaper.examPaperId} className="border shadow-md hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>{examPaper.examPaperCode}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <strong>Important Notes:</strong>
                                <ul>
                                    {examPaper.importants.length > 0 ? (
                                        examPaper.importants.map((important, index) => {
                                            const importantDetails = important.importantName || important.importantScrip || important.subject.subjectName;
                                            return (
                                                <li key={index} className="list-disc pl-5">
                                                    {importantDetails ? (
                                                        importantDetails
                                                    ) : (
                                                        <span className="italic text-gray-500">No important details available.</span>
                                                    )}
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li>No important notes available.</li>
                                    )}
                                </ul>
                            </div>
                            <Button variant="outline" className="mt-4">
                                View Paper Details
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
