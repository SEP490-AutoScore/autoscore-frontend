import React from "react";
import useSSE from "./grading-hook";

const SSEComponent: React.FC = () => {
  const events = useSSE("http://localhost:8081/events");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Grading process</h1>
      <ul className="mt-4 space-y-4">
        {events.map((event) => {
          // Tính toán tỷ lệ phần trăm tiến trình
          const progress = (event.successProcess / event.totalProcess) * 100;

          return (
            <li
              key={event.processId} // Sử dụng processId làm key để tránh render lại tất cả items
              className="p-4 border rounded shadow-md bg-gray-50"
            >
              <p><strong>Status:</strong> {event.status}</p>
              <div className="mt-2">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full">
                      <div
                        className="bg-teal-500 text-xs font-medium text-teal-100 text-center p-0.5 leading-none rounded-full"
                        style={{ width: `${progress}%` }}
                      >
                        {/* Thanh tiến trình */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p><strong>Start Date:</strong> {event.startDate}</p>
              <p><strong>Update Date:</strong> {event.updateDate}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SSEComponent;
