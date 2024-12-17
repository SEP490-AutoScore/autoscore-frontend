import { useState, useEffect } from "react";
import PermissionCategoryTable, {
  Role,
} from "@/app/authentication/role/detail/data-table-permission-category";
import { DataTableSkeleton } from "@/app/authentication/role/detail/data-table-skeleton";
import { NoResultPage, ErrorPage } from "@/app/authentication/error/page";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

async function getData(id: number): Promise<Role> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getRoleDetail}${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export default function Page({ reload }: { reload?: boolean }) {
  const [data, setData] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    if (!id) {
      setError("Role ID is required");
      return;
    }
    if (reload) {
      getData(id)
        .then((response) => {
          setData(response);
        })
        .catch((err) => setError(err.message));
        navigate("/roles/detail", { state: { reload: false, id: id } });
    } else {
      getData(id)
        .then((response) => {
          setData(response);
        })
        .catch((err) => setError(err.message));
    }
  }, [id, reload, navigate]);

  if (error) return <ErrorPage />;
  if (!data) return <DataTableSkeleton />;
  if (data === null) return <NoResultPage />;

  return (
    <div className="container mx-auto w-full border border-gray-200 p-8 rounded-lg">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{data.roleName}</h2>
          <p className="text-muted-foreground">{data.description}</p>
        </div>
      </div>
      {data.permissionsCategory.map((category) => (
        <PermissionCategoryTable
          key={category.permissionCategoryId}
          category={category}
          roleId={data.roleId}
          roleCode={data.roleCode}
        />
      ))}
    </div>
  );
}
