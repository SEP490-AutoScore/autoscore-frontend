import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardHeaderAnalysis } from "./card-header";
import { CircleUser, Frown, Smile } from "lucide-react";
import { BarChartComponent } from "./bar-chart";
import { BarChartPlagiarismComponent } from "./bar-chart-plagiarism";
import { RadarChartDotsComponent } from "./radar-chart-dots";
import { RadarChartDotsAllPassComponent } from "./radar-chart-dots-allpass";
import { RadarChartDotsNoPassComponent } from "./radar-chart-dots-nopass";
import { DropdownList } from "./dropdown-list";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { BarChartMultipleComponent } from "./bar-chart-multiple";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/analysis",
    breadcrumbPage: "Analysis",
  });

  const [selectedExamPaper, setSelectedExamPaper] = useState<string | null>(
    null
  );

  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [studentsWithZeroScore, setStudentsWithZeroScore] = useState<
    number | null
  >(null);
  const [
    studentsWithScoreGreaterThanZero,
    setStudentsWithScoreGreaterThanZero,
  ] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          throw new Error(
            `Error fetching total students: ${response.statusText}`
          );
        }
        const data = await response.text();
        setTotalStudents(Number(data));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else setError("An error occurred while fetching data.");
        setLoading(false);
      }
    };
    fetchTotalStudents();
  }, [selectedExamPaper]);

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
          throw new Error(
            `Error fetching students with zero score: ${response.statusText}`
          );
        }
        const data = await response.text();
        setStudentsWithZeroScore(Number(data));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else setError("An error occurred while fetching data.");
        setLoading(false);
      }
    };
    fetchStudentsWithZeroScore();
  }, [selectedExamPaper]);

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
          throw new Error(
            `Error fetching students with score > 0: ${response.statusText}`
          );
        }
        const data = await response.text();
        setStudentsWithScoreGreaterThanZero(Number(data));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else setError("An error occurred while fetching data.");
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
      <div className="p-4 pt-0 space-y-6">
        <div className="border border-gray-200 p-6 rounded-lg shadow-sm ml-11 mr-11">
          <div className="col-span-4 mb-6 ml-2 mr-2">
            
            <DropdownList onSelect={handleSelect} />
          </div>
          <div className="grid grid-cols-4 gap-6">
           
            <div className="col-span-4 md:col-span-4 grid grid-cols-3 gap-6 mb-6 ml-2 mr-2">
              {/* Total student in exam */}
              <CardHeaderAnalysis
                title="Total Students"
                description={
                  loading
                    ? "Loading total students..."
                    : error
                    ? "No data to Analysis"
                    : totalStudents !== null
                    ? `Count: ${totalStudents}`
                    : ""
                }
                icon={CircleUser}
                content="Student Statistics"
              />
              {/* Total student has score =0 */}
              <CardHeaderAnalysis
                title="Total Zero Score"
                description={
                  loading
                    ? "Loading zero score data..."
                    : error
                    ? "No data to Analysis"
                    : studentsWithZeroScore !== null
                    ? `Count: ${studentsWithZeroScore}`
                    : ""
                }
                icon={Frown}
                content="Student Statistics"
              />
              {/* Total student has score >0 */}
              <CardHeaderAnalysis
                title="Total Score > 0"
                description={
                  loading
                    ? "Loading score data..."
                    : error
                    ? "No data to Analysis"
                    : studentsWithScoreGreaterThanZero !== null
                    ? `Count: ${studentsWithScoreGreaterThanZero}`
                    : ""
                }
                icon={Smile}
                content="Student Statistics"
              />
            </div>
          </div>
          {/* Chart*/}
          <div className="space-y-6 ml-2 mr-2  ">
            {/* Radar Charts */}
            <div className="col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RadarChartDotsAllPassComponent
                examPaperId={selectedExamPaper || ""}
              />
              <RadarChartDotsComponent examPaperId={selectedExamPaper || ""} />
              <RadarChartDotsNoPassComponent
                examPaperId={selectedExamPaper || ""}
              />
            </div>
            {/* Bar Chart - Student Scores */}
            <BarChartComponent examPaperId={selectedExamPaper || ""} />
            {/* Bar Chart - Response Time */}
            <BarChartMultipleComponent examPaperId={selectedExamPaper || ""} />
            {/* Bar Chart - Plagiarism */}
            <BarChartPlagiarismComponent
              examPaperId={selectedExamPaper || ""}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
