import { columns } from "@/app/authentication/account/overview/columns";
import { DataTable } from "@/app/authentication/account/overview/data-table";
import { useState, useEffect } from "react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { DataTableSkeleton } from "@/app/authentication/account/overview/data-table-skeleton";
import { NoResultPage, ErrorPage } from '@/app/authentication/error/page';

interface Account {
  accountId: number;
  name: string;
  email: string;
  role: string;
  position: string;
  campus: string;
  employeeCode: string;
  avatar: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}

async function getData(): Promise<Account[]> {
  // Lấy token từ local storage
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }


  // Gửi request GET đến API
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllAccounts}`, {
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
  const data: Account[] = await res.json();
  return data;
}

export default function Page() {
  const [data, setData] = useState<Account[] | null>(null); // State để lưu dữ liệu
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
