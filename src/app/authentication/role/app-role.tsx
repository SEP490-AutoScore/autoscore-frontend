import { useState, useEffect } from "react";
import { DataTableSkeleton } from "@/app/authentication/permission/data-table-sekeleton";
import { NoResultPage, ErrorPage } from "@/app/authentication/error/page";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CardRole } from "./card-role";

interface RoleProps {
  roleId: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: boolean;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  totalUser: number;
}

async function getData(): Promise<RoleProps[]> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllRoles}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Đảm bảo luôn có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }
  

export default function Page() {
  const [data, setData] = useState<RoleProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData()
      .then((roles) => {
        // Đảm bảo `lastUpdatedAt` được định dạng đúng
        const formattedRoles = roles.map((role) => ({
          ...role,
          lastUpdatedAt: formatDate(role.lastUpdatedAt), // Định dạng ngày
        }));
        setData(formattedRoles);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorPage />;
  if (!data) return <DataTableSkeleton />;
  if (data.length === 0) return <NoResultPage />;

  return (
    <div className="container mx-auto w-full border border-gray-200 p-8 rounded-lg">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">
            Manage roles and permissions here.<br />
            You can customize roles in the details section.
          </p>
        </div>
        <Link to="#add-role">
          <Button
            variant="outline"
            className="ml-auto text-primary border-primary rounded-full px-6"
          >
            Add New
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-10 pt-10">
        {data.map((role) => (
          <CardRole key={role.roleId} {...role} />
        ))}
      </div>
    </div>
  );
}
