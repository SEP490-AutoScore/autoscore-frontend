import React from "react";

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
}

interface ExamQuestionItemProps {
    question: ExamQuestion;
    isExpanded: boolean;
    onToggle: () => void;
}

const ExamQuestionItem: React.FC<ExamQuestionItemProps> = ({ question, isExpanded, onToggle }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm space-y-2">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={onToggle}
            >
                <h3 className="font-bold text-lg">{question.questionContent}</h3>
                <span className="text-sm text-blue-500">
                    {isExpanded ? "Hide" : "Show"} Details
                </span>
            </div>

            {isExpanded && (
                <div className="space-y-2 mt-2">
                    <p>
                        <strong>Score:</strong> {question.examQuestionScore}
                    </p>
                    <p>
                        <strong>Endpoint:</strong> {question.endPoint}
                    </p>
                    <p>
                        <strong>Role Allow:</strong> {question.roleAllow}
                    </p>
                    <p>
                        <strong>HTTP Method:</strong> {question.httpMethod}
                    </p>
                    <p>
                        <strong>Description:</strong> {question.description}
                    </p>
                    {question.validation && (
                        <div>
                            <strong>Validation:</strong>
                            <pre className="bg-gray-100 p-2 rounded">{question.validation}</pre>
                        </div>
                    )}
                    {question.payload && (
                        <div>
                            <strong>Payload:</strong>
                            <pre className="bg-gray-100 p-2 rounded">{question.payload}</pre>
                        </div>
                    )}
                    {question.sucessResponse && (
                        <div>
                            <strong>Success Response:</strong>
                            <pre className="bg-gray-100 p-2 rounded">
                                {question.sucessResponse}
                            </pre>
                        </div>
                    )}
                    {question.errorResponse && (
                        <div>
                            <strong>Error Response:</strong>
                            <pre className="bg-gray-100 p-2 rounded">
                                {question.errorResponse}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamQuestionItem;
