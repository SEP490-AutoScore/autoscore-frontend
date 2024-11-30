import { useEffect, useState } from "react";

interface EventData {
  processId: number;
  status: string;
  startDate: string;
  updateDate: string;
  examPaperId: number;
}

const useSSE = (url: string): EventData[] => {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data: EventData = JSON.parse(event.data);
        setEvents((prevEvents) => {
          // Cập nhật event nếu nó có processId giống
          const updatedEvents = prevEvents.filter((e) => e.processId !== data.processId);
          return [...updatedEvents, data];  // Thêm event mới hoặc cập nhật nếu đã có
        });
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close(); // Đóng kết nối nếu có lỗi
    };

    return () => {
      eventSource.close(); // Cleanup khi component unmount
    };
  }, [url]);

  return events;
};

export default useSSE;
