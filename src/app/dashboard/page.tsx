import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardHeaderDashboard } from "./card-header";
import { Book, BookOpen, BookOpenCheck } from "lucide-react";
import { BarChartComponent } from "./bar-chart";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { TableStudentComponent } from "./table-student";
import { LineChartComponent } from "./line-chart";
import { PieChartComponent } from "./pie-chart";
import { BarChartCustomLabelComponent } from "./bar-chart-custom-label";
export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/dashboard",
    breadcrumbPage: "Dashboard",
  });

  const [examCount, setExamCount] = useState<number | null>(null);
  const [examGradingAtCount, setExamGradingAtCount] = useState<number | null>(
    null
  );
  const [examGradingAtPassedCount, setExamGradingAtPassedCount] = useState<
    number | null
  >(null);
  const [year, setYear] = useState<string>("2024");
  const [semesterData, setSemesterData] = useState({
    Spring: 0,
    Summer: 0,
    Fall: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const handleYearChange = (selectedYear: string) => {
    setYear(selectedYear);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    const fetchExamCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.examCount}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.text();
          setExamCount(parseInt(data, 10));
        } else {
          const errorData = await response.text();
          setError(errorData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setError("An error occurred while fetching the exam count.");
      } finally {
        setLoading(false);
      }
    };

    const fetchExamGradingAtCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.examcountByGradingAt}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.text();
          setExamGradingAtCount(parseInt(data, 10));
        } else {
          const errorData = await response.text();
          setError(errorData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setError("An error occurred while fetching the gradingAt exam count.");
      } finally {
        setLoading(false);
      }
    };

    const fetchExamGradingAtPassedCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.examcountByGradingAtPassed}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.text();
          setExamGradingAtPassedCount(parseInt(data, 10));
        } else {
          const errorData = await response.text();
          setError(errorData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setError(
          "An error occurred while fetching the gradingAt passed exam count."
        );
      } finally {
        setLoading(false);
      }
    };

    // Call API to get the number of Exams by semester and year
    const fetchSemesterData = async (year: string) => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.examCountByGradingAtPassedAndSemester}?year=${year}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSemesterData(data);
        } else {
          const errorData = await response.text();
          setError(errorData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setError("An error occurred while fetching semester data.");
      }
    };
    fetchExamCount();
    fetchExamGradingAtCount();
    fetchExamGradingAtPassedCount();
    fetchSemesterData(year);
  }, [year]);

  return (
    <SidebarInset>
      {Header}
      <div className="p-4 pt-0 space-y-6">
        <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Dashboard page</h2>
              <p className="text-muted-foreground">
                These are charts to analyze scores of all exam
              </p>
            </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-4 md:col-span-4 grid grid-cols-3 gap-6 mb-6 ">
              {/* Total exam */}
              <CardHeaderDashboard
                title="Total Exams"
                description={
                  loading
                    ? "Loading..."
                    : error
                      ? "No data to Analysis"
                      : examCount !== null
                        ? `Count: ${examCount.toString()}`
                        : ""
                }
                content="Exam Statistics"
                icon={BookOpen}
              />
              {/* Total exam has not been graded */}
              <CardHeaderDashboard
                title="Exams Not Graded"
                description={
                  loading
                    ? "Loading..."
                    : error
                      ? "No data to Analysis"
                      : examGradingAtCount !== null
                        ? `Count: ${examGradingAtCount.toString()}`
                        : ""
                }
                content="Exam Statistics"
                icon={Book}
              />
              {/* Total exam graded */}
              <CardHeaderDashboard
                title="Exams Graded"
                description={
                  loading
                    ? "Loading..."
                    : error
                      ? "No data to Analysis"
                      : examGradingAtPassedCount !== null
                        ? `Count: ${examGradingAtPassedCount.toString()}`
                        : ""
                }
                content="Exam Statistics"
                icon={BookOpenCheck}
              />
            </div>
          </div>
          {/* Bar Chart and Pie Chart on the same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              {/* Total exam each year */}
              <BarChartComponent data={semesterData} error={error} year={year} handleYearChange={handleYearChange} />
            </div>
            <div className="col-span-1">
              {/* Quality Score */}
              <PieChartComponent />
            </div>
          </div>
          <div className="space-y-6">
            {/* Score each student */}
            <LineChartComponent />
            {/* Score detail each student */}
            <TableStudentComponent />
            {/* All function api */}
            <BarChartCustomLabelComponent />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
