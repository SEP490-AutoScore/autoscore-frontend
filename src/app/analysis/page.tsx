import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardHeaderAnalysis } from "./card-header";
import { Book } from "lucide-react";
import { BarChartComponent } from "./bar-chart";

import { RadarChartDotsComponent } from "./radar-chart-dots";
import { RadarChartDotsAllPassComponent } from "./radar-chart-dots-allpass";
import { RadarChartDotsNoPassComponent } from "./radar-chart-dots-nopass";
import { DropdownList } from "./dropdown-list";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { BarChartMultipleComponent } from "./bar-chart-multiple";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/dashboard",
    breadcrumbPage: "Dashboard",
  });

  const [selectedExamPaper, setSelectedExamPaper] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [studentsWithZeroScore, setStudentsWithZeroScore] = useState<number | null>(null);
  const [studentsWithScoreGreaterThanZero, setStudentsWithScoreGreaterThanZero] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API khi examPaperId thay đổi
  useEffect(() => {
    if (!selectedExamPaper) return;

    const fetchTotalStudents = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.totalStudents}?examPaperId=${selectedExamPaper}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching total students: ${response.statusText}`);
        }

        const data = await response.text(); // API trả về dạng plaintext
        setTotalStudents(Number(data)); // Chuyển dữ liệu thành số
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTotalStudents();
  }, [selectedExamPaper]);

  // Gọi API số học sinh có điểm bằng 0
  useEffect(() => {
    if (!selectedExamPaper) return;

    const fetchStudentsWithZeroScore = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.studentsWithZeroScore}?examPaperId=${selectedExamPaper}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching students with zero score: ${response.statusText}`);
        }

        const data = await response.text();
        setStudentsWithZeroScore(Number(data));
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentsWithZeroScore();
  }, [selectedExamPaper]);

  // Gọi API số học sinh có điểm > 0
  useEffect(() => {
    if (!selectedExamPaper) return;

    const fetchStudentsWithScoreGreaterThanZero = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.studentsWithScoreGreaterThanZero}?examPaperId=${selectedExamPaper}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching students with score > 0: ${response.statusText}`);
        }

        const data = await response.text();
        setStudentsWithScoreGreaterThanZero(Number(data));
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentsWithScoreGreaterThanZero();
  }, [selectedExamPaper]);


  const handleSelect = (examPaperId: string) => {
    setSelectedExamPaper(examPaperId);
  };
  return (
    <SidebarInset>
      {Header}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-8 gap-6">

          <div className="col-span-2">
            <DropdownList onSelect={handleSelect} />
          </div>


          {/* Thông tin tổng học sinh */}
          <div className="col-span-2">
            <CardHeaderAnalysis
              title="Total Students"
              content=""
              description={
                loading
                  ? "Loading total students..."
                  : error
                    ? `Error: ${error}`
                    : totalStudents !== null
                      ? ` ${totalStudents}`
                      : "Overview"
              }
              icon={Book}
            />
          </div>


          {/* Thông tin học sinh điểm 0 */}
          <div className="col-span-2">
            <CardHeaderAnalysis
              title="Total students 0 point"
              content=""
              description={
                loading
                  ? "Loading zero score data..."
                  : error
                    ? `Error: ${error}`
                    : studentsWithZeroScore !== null
                      ? ` ${studentsWithZeroScore}`
                      : "Overview"
              }
              icon={Book}
            />
          </div>



          {/* Thông tin học sinh điểm > 0 */}
          <div className="col-span-2">
            <CardHeaderAnalysis
              title="Total students than 0 point"
              content=""
              description={
                loading
                  ? "Loading score data..."
                  : error
                    ? `Error: ${error}`
                    : studentsWithScoreGreaterThanZero !== null
                      ? ` ${studentsWithScoreGreaterThanZero}`
                      : "Overview"
              }
              icon={Book}
            />

          </div>


  {/* score each student */}
          <div className="col-span-2">

            <BarChartComponent examPaperId={selectedExamPaper || ""} />


          </div>



           {/* pass toàn phần */}
           <div className="col-span-2">

<RadarChartDotsAllPassComponent examPaperId={selectedExamPaper || ""} />


</div>


          {/* pass 1 phần */}

          <div className="col-span-2">

            <RadarChartDotsComponent examPaperId={selectedExamPaper || ""} />


          </div>

            {/* ko pass phần nào */}

            <div className="col-span-2">

<RadarChartDotsNoPassComponent examPaperId={selectedExamPaper || ""} />


</div>

         
 {/* phản hồi api từng sinh viên */}

<div className="col-span-2">
  <BarChartMultipleComponent examPaperId={selectedExamPaper || ""} />
</div>
        


        </div>

      </div>
    </SidebarInset>
  );
}
