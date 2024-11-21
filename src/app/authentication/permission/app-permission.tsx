import { useState, useEffect } from "react";
import PermissionCategoryTable, {
  Permissions,
} from "@/app/authentication/permission/data-table-permission-category";
import { columns } from "@/app/authentication/permission/columns";
import { DataTableSkeleton } from "@/app/authentication/permission/data-table-sekeleton";
import { NoResultPage, ErrorPage } from "@/app/authentication/error/page";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

async function getData(): Promise<Permissions[]> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllPermisisons}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export default function Page() {
  const [data, setData] = useState<Permissions[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorPage />;
  if (!data) return <DataTableSkeleton />;
  if (data.length === 0) return <NoResultPage />;

  return (
    <div className="container mx-auto w-full border border-gray-200 p-8 rounded-lg">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permissions</h2>
          <p className="text-muted-foreground">
            Here's a list of permissions in the system!
          </p>
        </div>
        <Link to="#">
          <Button variant="outline" className="ml-auto text-primary border-primary rounded-full px-6">
            Add New
          </Button>
        </Link>
      </div>
      {data.map((category) => (
        <PermissionCategoryTable
          key={category.permissionCategoryId}
          category={category}
          columns={columns}
        />
      ))}
    </div>
  );
}
