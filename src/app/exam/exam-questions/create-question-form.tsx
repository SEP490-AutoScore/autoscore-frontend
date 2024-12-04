import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateQuestionFormProps {
    onCreate: (newQuestionData: any) => void;
    onClose: () => void;
}

const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({ onCreate, onClose }) => {
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
            examPaperId: 0,
        };
        onCreate(newQuestionData);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                className="bg-white p-6 rounded-lg w-3/4 max-w-3xl"
                style={{
                    maxHeight: "90vh", // Giới hạn chiều cao tối đa
                    overflowY: "auto", // Kích hoạt cuộn nếu nội dung vượt quá chiều cao
                }}
            >
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

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="submit"
                            className="w-auto bg-white text-black hover:bg-orange-500 hover:text-white"
                        >
                            Create Question
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="w-auto bg-white text-black hover:bg-orange-500 hover:text-white"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuestionForm;
