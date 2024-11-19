import React, { useEffect, useState } from "react";
import ExamPaperDetail from "./exam-paper-detail";
import Ske from "./skeleton-page"
import { ErrorPage } from '@/app/error/page';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface ExamPaper {
  examPaperId: number;
  examPaperCode: string;
  instruction: string | null;
}

interface ExamPaperProps {
  examId: number; // Đầu vào
}

const Detail: React.FC<ExamPaperProps> = ({ examId }) => {
  const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State lưu trữ thông tin mục được chọn
  const [selectedItem, setSelectedItem] = useState<ExamPaper | null>(null);

  // Fetch danh sách exam papers
  useEffect(() => {
    const fetchExamPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
        }

        const response = await fetch("http://localhost:8080/api/exam-paper/list", {
          method: "POST", // API yêu cầu POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examId }), // Truyền `examId` vào request body
        });

        if (!response.ok) {
          throw new Error(`Error fetching exam papers: ${response.status}`);
        }

        const data: ExamPaper[] = await response.json(); // Kết quả trả về
        setExamPapers(data); // Cập nhật danh sách Exam Papers

        // Nếu có dữ liệu, chọn mục đầu tiên
        if (data.length > 0) {
          setSelectedItem(data[0]);
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchExamPapers();
  }, [examId]);

  if (loading) {
    return <Ske />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (examPapers.length === 0) {
    return <div>No exam papers found for this exam.</div>;
  }

  // Hàm xử lý khi nhấp vào một mục
  const handleItemClick = (item: ExamPaper) => {
    setSelectedItem(item);  // Cập nhật item đã chọn
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25}>
        <div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {examPapers.map((examPaper) => (
              <li
                key={examPaper.examPaperId}
                onClick={() => handleItemClick(examPaper)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  backgroundColor: selectedItem?.examPaperId === examPaper.examPaperId ? "#f0f0f0" : "white",
                  border: "1px solid #ddd",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              >
                {examPaper.examPaperCode}
              </li>
            ))}
          </ul>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        {selectedItem ? (
          <ExamPaperDetail examPaperId={selectedItem.examPaperId} />
        ) : (
          <p>Please select an item from the list.</p>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Detail;
