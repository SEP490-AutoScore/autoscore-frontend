import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Plus } from "lucide-react";
import { checkPermission } from "@/hooks/use-auth";

interface ExamQuestionsCreateProps {
    examPaperId: number;
}

const CreateQuestionForm: React.FC<ExamQuestionsCreateProps> = ({ examPaperId }) => {
    const [questionContent, setQuestionContent] = useState<string>("");
    const [examQuestionScore, setExamQuestionScore] = useState<number>(0);
    const [endPoint, setEndPoint] = useState<string>("");
    const [roleAllow, setRoleAllow] = useState<string>("");
    const [httpMethod, setHttpMethod] = useState<string>("GET");
    const [description, setDescription] = useState<string>("");
    const [payloadType, setPayloadType] = useState<string>("JSON");
    const [payload, setPayload] = useState<string>("");
    const [validation, setValidation] = useState<string>("");
    const [sucessResponse, setSuccessResponse] = useState<string>("");
    const [errorResponse, setErrorResponse] = useState<string>("");

    const showToast = useToastNotification();
    const hasPermission = checkPermission({ permission: "CREATE_QUESTION" });
    if (!hasPermission) {
        return <></>
    }

    const handleCreateQuestion = (newQuestionData: any) => {
        const token = localStorage.getItem("jwtToken");

        const requestBody = { ...newQuestionData };

        fetch(`${BASE_URL}${API_ENDPOINTS.getQuestion}`, {
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
            .then(() => {
                showToast({
                    title: "Create success",
                    description: "Create new exam paper success",
                    variant: "default",
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newQuestionData = {
            questionContent,
            examQuestionScore,
            endPoint,
            roleAllow,
            httpMethod,
            description,
            payloadType,
            payload,
            validation,
            sucessResponse,
            errorResponse,
            orderBy: 0,
            examPaperId: examPaperId,
        };
        handleCreateQuestion(newQuestionData);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    variant="outline"
                    className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[100vh] max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <h3>Create New Question</h3>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="questionContent">Question Content</Label>
                        <Input
                            id="questionContent"
                            type="text"
                            value={questionContent}
                            onChange={(e) => setQuestionContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="examQuestionScore">Exam Question Score</Label>
                            <Input
                                id="examQuestionScore"
                                type="number"
                                value={examQuestionScore}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    if (value >= 0) {
                                        setExamQuestionScore(value);
                                    }
                                }}
                                min="0"
                                step="0.1"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="httpMethod">HTTP Method</Label>
                            <select
                                id="httpMethod"
                                value={httpMethod}
                                onChange={(e) => setHttpMethod(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="endPoint">Endpoint</Label>
                            <Input
                                id="endPoint"
                                type="text"
                                value={endPoint}
                                onChange={(e) => setEndPoint(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="roleAllow">Role Allow</Label>
                            <Input
                                id="roleAllow"
                                type="text"
                                value={roleAllow}
                                onChange={(e) => setRoleAllow(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="payloadType">Payload Type</Label>
                        <select
                            id="payloadType"
                            value={payloadType}
                            onChange={(e) => setPayloadType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="JSON">JSON</option>
                            <option value="URL Parameter">URL Parameter</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="payload">Payload</Label>
                        <Textarea
                            id="payload"
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="validation">Validation</Label>
                        <Input
                            id="validation"
                            type="text"
                            value={validation}
                            onChange={(e) => setValidation(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="successResponse">Success Response</Label>
                        <Textarea
                            id="successResponse"
                            value={sucessResponse}
                            onChange={(e) => setSuccessResponse(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="errorResponse">Error Response</Label>
                        <Textarea
                            id="errorResponse"
                            value={errorResponse}
                            onChange={(e) => setErrorResponse(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit"
                            variant="outline"
                            className="mt-4 w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-blue-400">
                            Create Question
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateQuestionForm;
