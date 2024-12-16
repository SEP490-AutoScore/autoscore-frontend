import React, { useEffect, useState } from "react";
import useSSE from "./grading-hook";
import { GRADING_URL } from "@/config/apiConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

const STATUS_NODES = ["PENDING", "IMPORTANT", "GRADING", "PLAGIARISM", "DONE"];

interface InitialProgress {
  processId: number;
  status: string;
  startDate: string;
  updateDate: string;
  examPaperId: number;
}

interface SSEEvent {
  processId: number;
  status: string;
  startDate: string;
  updateDate: string;
  examPaperId: number;
}

interface SSEComponentProps {
  examPaperId: number;
}

const SSEComponent: React.FC<SSEComponentProps> = ({ examPaperId }) => {
  const [initialProgress, setInitialProgress] = useState<InitialProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradingNotFound, setGradingNotFound] = useState(false);
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  // Subscribe to SSE events
  const events: SSEEvent[] = useSSE(`${GRADING_URL}${API_ENDPOINTS.events}`);

  useEffect(() => {
    const fetchInitialProgress = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.gradingProcess}?examPaperId=${examPaperId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data && data.examPaperId === examPaperId) {
          setInitialProgress(data);
          setGradingNotFound(false);
        } else {
          setGradingNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch initial progress:", error);
        setGradingNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProgress();
  }, [examPaperId, token]);

  // Update the progress when an event is received
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events.find(
        (event) => initialProgress && event.processId === initialProgress.processId
      );

      if (latestEvent) {
        setInitialProgress((prevProgress) =>
          prevProgress
            ? {
                ...prevProgress,
                status: latestEvent.status,
                updateDate: latestEvent.updateDate,
              }
            : prevProgress
        );
      }
    }
  }, [events, initialProgress]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-gray-700">
        Loading grading process...
      </div>
    );
  }

  if (gradingNotFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="p-3 bg-white rounded-lg shadow-md text-gray-700 w-full">
          <p>This exam is not currently being graded.</p>
        </div>
      </div>
    );
  }

  const isDone = initialProgress?.status === "DONE";

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Grading Process</h1>

      {initialProgress && (
        <div className="mt-6">
          <div className={`p-6 border rounded-lg shadow-sm ${initialProgress.status === "Error" ? "bg-red-50 border-red-500" : "bg-gray-50"}`}>
            <p className={`text-lg font-semibold ${initialProgress.status === "Error" ? "text-red-600" : "text-gray-700"}`}>
              <strong>Status:</strong> {initialProgress.status}
            </p>

            <div className="mt-4 flex justify-center">
              <div className="flex items-center">
                {STATUS_NODES.map((status, index) => {
                  const isCompleted = isDone || index < STATUS_NODES.indexOf(initialProgress.status);
                  const isActive = index === STATUS_NODES.indexOf(initialProgress.status);

                  return (
                    <div key={status} className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-full ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isActive
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-500"
                            }`}
                          >
                            {isCompleted ? "✔" : index + 1}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>{status}</span>
                        </TooltipContent>
                      </Tooltip>

                      {index < STATUS_NODES.length - 1 && (
                        <div
                          className={`h-2 w-56 ${
                            isCompleted
                              ? "bg-green-500"
                              : isActive
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Start Date:</strong> {initialProgress.startDate}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Update Date:</strong> {initialProgress.updateDate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSEComponent;
