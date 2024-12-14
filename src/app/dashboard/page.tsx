import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardHeaderDashboard } from "./card-header";
import { Book, BookCheck, BookUser, Frame, LucideBookCheck, MenuSquare, SquareSigma, TestTubeDiagonal } from "lucide-react";
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
  }); // Store exam counts by semester for selected year
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    // Gọi API để lấy số lượng Exam
    const fetchExamCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.examCount}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.text(); // Dữ liệu trả về là plain text
          setExamCount(parseInt(data, 10)); // Chuyển đổi dữ liệu trả về thành kiểu số
        } else {
          const errorData = await response.text();
          setError(errorData); // Hiển thị lỗi nếu API không thành công
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

    // Gọi API để lấy số lượng Exam có gradingAt đã vượt qua thời gian hiện tại
    const fetchExamGradingAtCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.examcountByGradingAt}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.text(); // Dữ liệu trả về là plain text
          setExamGradingAtCount(parseInt(data, 10)); // Chuyển đổi dữ liệu trả về thành kiểu số
        } else {
          const errorData = await response.text();
          setError(errorData); // Hiển thị lỗi nếu API không thành công
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

    // Gọi API để lấy số lượng Exam có gradingAt đã vượt qua thời gian hiện tại
    const fetchExamGradingAtPassedCount = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.examcountByGradingAtPassed}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.text(); // Dữ liệu trả về là plain text
          setExamGradingAtPassedCount(parseInt(data, 10)); // Chuyển đổi dữ liệu trả về thành kiểu số
        } else {
          const errorData = await response.text();
          setError(errorData); // Hiển thị lỗi nếu API không thành công
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

    // Gọi API để lấy số lượng Exam theo kỳ học và năm
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
          const data = await response.json(); // Dữ liệu trả về là JSON
          setSemesterData(data); // Cập nhật dữ liệu của các kỳ học
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
      <div className="p-4 pt-0">
        <div className="grid grid-cols-6 gap-6">

          <div className="col-span-2">
            <CardHeaderDashboard
              title="Total Exams"
              content={
                loading
                  ? "Loading..."
                  : examCount !== null
                  ? examCount.toString()
                  : "Error"
              }
              description="Total number of exams."
              icon={Book}

            />
          </div>

          <div className="col-span-2">
            <CardHeaderDashboard

              title="Exams Grading Over Time"
              content={
                loading
                  ? "Loading..."
                  : examGradingAtCount !== null
                  ? examGradingAtCount.toString()
                  : "Error"
              }
              description="Number of exams passed the current time."
              icon={Book}

            />
          </div>

          <div className="col-span-2">
            <CardHeaderDashboard

              title="Exams Grading At Passed"
              content={
                loading
                  ? "Loading..."
                  : examGradingAtPassedCount !== null
                  ? examGradingAtPassedCount.toString()
                  : "Error"
              }
              description="Number of exams is passed."
              icon={Book}

            />
          </div>
          <div className="col-span-3 grid grid-cols-2">
            {/* Bar chart for semester data */}
            <div className="col-span-2">
              <BarChartComponent
                data={semesterData}
                loading={loading}
                error={error}
                year={year}
                handleYearChange={handleYearChange}
              />
            </div>
            <div className="col-span-2">
              <TableStudentComponent />{" "}
              {/* This will render the table of top students */}
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-1">
            {/* Line Chart Component */}
            <div className="col-span-1">
              <LineChartComponent /> {/* Render the new LineChartComponent */}
            </div>
            {/* Insert TableStudentComponent */}
            <div className="col-span-1">
              <PieChartComponent /> {/* Render the new LineChartComponent */}
            </div>
            <div className="col-span-1">
              <BarChartCustomLabelComponent />{" "}
              {/* Render the new LineChartComponent */}
            </div>
          </div>

        </div>
        {/* <div className="col-span-4">
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
          </div> */}

      </div>
    </SidebarInset>
  );
}
