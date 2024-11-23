import { columns } from "@/app/exam/overview/columns";
import { DataTable } from "@/app/exam/overview/data-table";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { DataTableSkeleton } from "@/app/exam/overview/data-table-skeleton";
import { NoResultPage, ErrorPage } from '@/app/authentication/error/page';

interface Exams {
  examId: number;
  examCode: string;
  examAt: Date;
  gradingAt: Date;
  publishAt: Date;
  semester: Semester;
  subject: Subject;
}

interface Semester {
  semesterId: number;
  semesterCode: string;
  semesterName: string;
}

interface Subject {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
}

async function getData(): Promise<Exams[]> {
  // Lấy token từ local storage
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  // Payload để gửi lên server
  const payload = {
    searchString: "",
    subjectId: 0,
    examAt: new Date().toISOString(),
    gradingAt: new Date().toISOString(),
    publishAt: new Date().toISOString(),
    paginateEntity: {
      currentPage: 1,
      pageItem: 10,
    },
  };

  // Gửi request POST đến API
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllExams}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  // Xử lý lỗi nếu API không trả về phản hồi hợp lệ
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch data: ${error}`);
  }

  // Parse và trả về dữ liệu JSON
  const data: Exams[] = await res.json();
  return data;
}

export default function Page() {
  const [data, setData] = useState<Exams[] | null>(null); // State để lưu dữ liệu
  const [error, setError] = useState<string | null>(null); // State để lưu lỗi nếu có

  useEffect(() => {
    // Gọi API khi component được render
    getData()
      .then((fetchedData) => setData(fetchedData))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <ErrorPage />
  }

  if (!data) {
    return <DataTableSkeleton />;
  }

  if (data.length === 0) {
    return <NoResultPage />;
  }

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
