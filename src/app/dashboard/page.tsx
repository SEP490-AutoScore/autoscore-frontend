import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardHeaderDashboard } from "./card-header";
import { Book } from "lucide-react";
import { BarChartComponent } from "./bar-chart";
import { PieChartComponent } from "./pie-chart";
import { LineChartComponent } from "./line-chart";
import { DataTableDemo } from "./data-table";
import { BarChartHorizontalComponent } from "./bar-chart-horizontal";
import { DropdownList } from "./dropdown-list";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/dashboard",
    breadcrumbPage: "Dashboard",
  });

  const [selectedExamPaper, setSelectedExamPaper] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [studentsWithZeroScore, setStudentsWithZeroScore] = useState<number | null>(null);
  const [studentsWithScoreGreaterThanZero, setStudentsWithScoreGreaterThanZero] = useState<number | null>(null);
  const [studentScores, setStudentScores] = useState<
    { studentCode: string; totalScore: number }[]
  >([]);
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

  useEffect(() => {
    if (!selectedExamPaper) return;

    const fetchStudentScores = async () => {
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
          `${BASE_URL}${API_ENDPOINTS.studentScores}?examPaperId=${selectedExamPaper}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching student scores: ${response.statusText}`);
        }

        const data = await response.json(); // API trả về danh sách JSON
        setStudentScores(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentScores();
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
            <CardHeaderDashboard
              title="Total Students"
              content="Student Statistics"
              description={
                loading
                  ? "Loading total students..."
                  : error
                    ? `Error: ${error}`
                    : totalStudents !== null
                      ? `Total Students: ${totalStudents}`
                      : "Overview"
              }
              icon={Book}
            />
          </div>


          {/* Thông tin học sinh điểm 0 */}
          <div className="col-span-2">
            <CardHeaderDashboard
              title="Students with Zero Score"
              content="Student Statistics"
              description={
                loading
                  ? "Loading zero score data..."
                  : error
                    ? `Error: ${error}`
                    : studentsWithZeroScore !== null
                      ? `Zero Score: ${studentsWithZeroScore}`
                      : "Overview"
              }
              icon={Book}
            />
          </div>



          {/* Thông tin học sinh điểm > 0 */}
          <div className="col-span-2">
            <CardHeaderDashboard
              title="Students with Score > 0"
              content="Student Statistics"
              description={
                loading
                  ? "Loading score data..."
                  : error
                    ? `Error: ${error}`
                    : studentsWithScoreGreaterThanZero !== null
                      ? `Score > 0: ${studentsWithScoreGreaterThanZero}`
                      : "Overview"
              }
              icon={Book}
            />
          </div>

          <div className="col-span-8">
            {loading ? (
              <p>Loading student scores...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <BarChartComponent data={studentScores} />
            )}
          </div>


          <div className="col-span-4">
            <LineChartComponent />
          </div>
          <div className="col-span-4 border border-gray-200 p-4 rounded-lg shadow">
            <DataTableDemo />
          </div>
          <div className="col-span-2">
            <BarChartHorizontalComponent />
          </div>
          <div className="col-span-2">
            <PieChartComponent />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
