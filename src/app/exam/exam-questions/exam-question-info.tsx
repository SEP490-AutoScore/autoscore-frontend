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

const ExamQuestionItem: React.FC<ExamQuestionItemProps> = ({
  question,
  examPaperId,
  isExpanded,
  onToggle,
}) => {
  return (
    <div
      className="border p-4 rounded-lg space-y-2 mx-4 cursor-pointer hover:shadow-lg mb-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 min-w-[80%]" onClick={onToggle}>
          <h3 className="font-semibold text-lg">{question.questionContent}</h3>
        </div>
        <div>
          <UpdateQuestion
            examPaperId={examPaperId}
            questionId={question.examQuestionId}
          />
        </div>
      </div>

      {/* Hiển thị chi tiết khi mở rộng */}
      {isExpanded && (
        <div className="space-y-4 text-sm">
          <div>
            <strong>Score:</strong> {question.examQuestionScore}
          </div>
          <div>
            <strong>Description:</strong> {question.description}
          </div>
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
              <pre className="p-2 border rounded bg-gray-50 whitespace-pre-wrap">
                {question.validation}
              </pre>
            </div>
          )}
          {question.payload && (
            <div>
              <strong>Payload:</strong>
              <pre className="p-2 border rounded bg-gray-50 whitespace-pre-wrap">
                {question.payload}
              </pre>
            </div>
          )}
          {question.sucessResponse && (
            <div>
              <strong>Success Response:</strong>
              <pre className="p-2 border rounded bg-gray-50 whitespace-pre-wrap">
                {question.sucessResponse}
              </pre>
            </div>
          )}
          {question.errorResponse && (
            <div>
              <strong>Error Response:</strong>
              <pre className="p-2 border rounded bg-gray-50 whitespace-pre-wrap">
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
