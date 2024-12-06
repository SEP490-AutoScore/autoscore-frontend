import React from "react";
import UpdateQuestion from "@/app/exam/exam-questions/update-question-form";

interface ExamQuestion {
    examQuestionId: number;
    questionContent: string;
    examQuestionScore: number;
    endPoint: string;
    roleAllow: string;
    httpMethod: string;
    description: string;
    payloadType: string | null;
    payload: string | null;
    validation: string | null;
    sucessResponse: string | null;
    errorResponse: string | null;
    orderBy: number;
    examPaperId: number;
}

interface ExamQuestionItemProps {
    question: ExamQuestion;
    examPaperId: number;
    isExpanded: boolean;
    onToggle: () => void;
}

const ExamQuestionItem: React.FC<ExamQuestionItemProps> = ({ question, examPaperId, isExpanded, onToggle }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{question.questionContent}</h3>
                <div className="flex space-x-2">
                    {/* Nút bật/tắt thông tin */}
                    <button
                        onClick={onToggle}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                    >
                        {isExpanded ? "Hide Details" : "Show Details"}
                    </button>
                    <UpdateQuestion
                        examPaperId={examPaperId}
                        questionId={question.examQuestionId}
                    />
                </div>
            </div>

            {/* Hiển thị chi tiết khi mở rộng */}
            {isExpanded && (
                <div className="space-y-2 mt-2">
                    <p>
                        <strong>Score:</strong> {question.examQuestionScore}
                    </p>
                    <p>
                        <strong>Description:</strong> {question.description}
                    </p>
                    {/* Bố cục dạng thẻ cho Endpoint, Role Allow, HTTP Method */}
                    <div className="flex space-x-4">
                        <div className="flex-1 p-4 border rounded-lg">
                            <strong>Endpoint</strong>
                            <p>{question.endPoint}</p>
                        </div>
                        <div className="flex-1 p-4 border rounded-lg">
                            <strong>Role Allow</strong>
                            <p>{question.roleAllow}</p>
                        </div>
                        <div className="flex-1 p-4 border rounded-lg">
                            <strong>HTTP Method</strong>
                            <p>{question.httpMethod}</p>
                        </div>
                    </div>
                    {question.validation && (
                        <div>
                            <strong>Validation:</strong>
                            <pre className="p-2 border rounded bg-gray-100">{question.validation}</pre>
                        </div>
                    )}
                    {question.payload && (
                        <div>
                            <strong>Payload:</strong>
                            <pre className="p-2 border rounded bg-gray-100">{question.payload}</pre>
                        </div>
                    )}
                    {question.sucessResponse && (
                        <div>
                            <strong>Success Response:</strong>
                            <pre className="p-2 border rounded bg-gray-100">{question.sucessResponse}</pre>
                        </div>
                    )}
                    {question.errorResponse && (
                        <div>
                            <strong>Error Response:</strong>
                            <pre className="p-2 border rounded bg-gray-100">{question.errorResponse}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamQuestionItem;
