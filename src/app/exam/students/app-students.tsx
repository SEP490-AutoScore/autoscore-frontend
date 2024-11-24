import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { DataTableSkeleton } from "./data-table-skeleton";
import { NoResultPage, ErrorPage } from '@/app/authentication/error/page';
import { useLocation } from "react-router-dom";

interface Students {
  studentCode: string;
  studentEmail: string;
  examCode: string;
  campus: string;
}

async function getData(examId: number): Promise<Students[]> {
  // Lấy token từ local storage
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  // Gửi request POST đến API
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllStudents}?examId=${examId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Xử lý lỗi nếu API không trả về phản hồi hợp lệ
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch data: ${error}`);
  }

  // Parse và trả về dữ liệu JSON
  const data: Students[] = await res.json();
  return data;
}

export default function Page() {
  const [data, setData] = useState<Students[] | null>(null); // State để lưu dữ liệu
  const [error, setError] = useState<string | null>(null); // State để lưu lỗi nếu có
  const location = useLocation();
  const { examId } = location.state || {};

  useEffect(() => {
    if (!examId) {
      return;
    }
    getData(examId)
      .then((fetchedData) => setData(fetchedData))
      .catch((err) => setError(err.message));
  }, [examId]);

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
