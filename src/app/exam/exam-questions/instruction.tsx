import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface Subject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
}

interface Important {
  importantId: number;
  importantName: string;
  importantCode: string;
  importantScrip: string;
  subject: Subject;
}

interface ExamPaperResponse {
  examPaperId: number;
  examPaperCode: string;
  importants: Important[];
  isUsed: boolean;
  status: string;
  instruction: string;
  duration: number;
}

interface InfoProps {
  examPaperId: number;
}

const InfoComponent: FC<InfoProps> = ({ examPaperId }) => {
  const [examPaper, setExamPaper] = useState<ExamPaperResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const token = localStorage.getItem("jwtToken");

  // Gọi API khi component được render
  useEffect(() => {
    const fetchExamPaper = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Thêm token vào header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exam paper');
        }
        const data: ExamPaperResponse = await response.json();
        setExamPaper(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamPaper();
  }, [examPaperId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Hiển thị trong một card duy nhất */}
      <Card className="bg-white shadow-md rounded-lg border border-gray-200">
        <CardHeader className="font-semibold p-4">
          Introduction
        </CardHeader>
        <CardContent className="p-4 text-sm text-gray-700">
          {/* Hướng dẫn */}
          {examPaper?.instruction ? (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Instructions</h3>
              <pre className="whitespace-pre-wrap">{examPaper.instruction}</pre>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">No instructions available</h3>
              <p>No instructions available.</p>
            </div>
          )}
        
          {/* Các thông tin quan trọng */}
          <h3 className="font-semibold text-lg mb-2">Important</h3>
          <div className="space-y-4 ml-4">
            {examPaper?.importants && examPaper.importants.length > 0 ? (
              examPaper.importants.map((item) => (
                <div key={item.importantId} className="mb-4">
                  <h4 className="font-semibold text-base mb-2">{item.importantName}</h4>
                  <pre className="whitespace-pre-wrap">{item.importantScrip}</pre>
                </div>
              ))
            ) : (
              <div className="mb-4">
                <h4 className="font-semibold text-base mb-2">No important information found</h4>
                <p>No important information available.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoComponent;
