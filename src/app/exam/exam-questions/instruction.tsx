import { FC, useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Separator } from "@/components/ui/separator";
import { Dot } from "lucide-react";

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
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("jwtToken");

  // Gọi API khi component được render
  useEffect(() => {
    const fetchExamPaper = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.getExamPaperInfo}/${examPaperId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exam paper");
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
    <div className="space-y-4 mx-2">
      <div className="mx-4">
        <Separator className="h-1 bg-primary rounded" />
      </div>
      <CardHeader className="font-semibold text-2xl p-4">
        <CardTitle>Introduction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mx-0 px-4">
        {examPaper?.instruction ? (
          <div>
            <span className="font-semibold text-lg mb-2">Instructions</span>
            <div className="space-y-4 ml-4">
              <div className="mb-4 flex items-start">
                <div className="mr-2">
                  <Dot />
                </div>
                <p className="whitespace-pre-wrap text-sm">
                  {examPaper.instruction}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <span className="font-semibold text-base mb-2">No instructions available</span>
            <p className="whitespace-pre-wrap text-sm">No instructions available.</p>
          </div>
        )}

        {/* Các thông tin quan trọng */}
        <h3 className="font-semibold text-lg mb-2">Important</h3>
        <div className="space-y-4 ml-4">
          {examPaper?.importants && examPaper.importants.length > 0 ? (
            examPaper.importants.map((item) => (
              <div key={item.importantId} className="mb-4 flex items-start">
                <div className="mr-2">
                  <Dot />
                </div>
                <div>
                  <span className="font-semibold text-base mb-2">
                    {item.importantName}
                  </span>
                  <p className="whitespace-pre-wrap text-sm">
                    {item.importantScrip}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="mb-4">
              <span className="font-semibold text-base mb-2">
                No important information found
              </span>
              <p className="whitespace-pre-wrap text-sm">
                No important information available.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default InfoComponent;
