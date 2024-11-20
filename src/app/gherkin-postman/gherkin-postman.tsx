import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // Import useParams để lấy examPaperId từ URL

interface Question {
  questionId: number;
  title: string;
  description: string;
  endpoint: string;
  method: string;
}

interface GherkinPostmanProps {
  data: {
    examPaperId: number;
    examPaperCode: string;
    description: string;
    questions: Question[];
  };
}

const GherkinPostman: React.FC = () => {
  const { examPaperId } = useParams();  // Lấy examPaperId từ URL
  const [data, setData] = useState<GherkinPostmanProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra nếu examPaperId có sẵn trong URL
    if (examPaperId) {
      // Gọi API để lấy dữ liệu cho bài thi này
      fetch(`/api/exam-papers/${examPaperId}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);  // Lưu dữ liệu vào state
          setLoading(false);  // Cập nhật trạng thái loading
        })
        .catch((error) => {
          setError("Lỗi khi tải dữ liệu.");  // Hiển thị lỗi nếu có
          setLoading(false);
        });
    }
  }, [examPaperId]);  // Chạy lại mỗi khi examPaperId thay đổi

  // Nếu đang tải dữ liệu hoặc có lỗi
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      {/* Header thông tin bài thi */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Exam Paper: {data?.data.examPaperCode}</h1>
        <p className="text-gray-600">ID: {data?.data.examPaperId}</p>
        <p className="text-gray-700 mt-2">{data?.data.description}</p>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-4">
        {data?.data.questions.map((question) => (
          <div key={question.questionId} className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{question.title}</h2>
            <p className="text-gray-600">{question.description}</p>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-semibold">Endpoint:</span> {question.endpoint}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Method:</span> {question.method}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GherkinPostman;
