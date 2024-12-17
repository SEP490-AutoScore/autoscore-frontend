import { useState, useEffect } from "react";
import PermissionCategoryTable, {
  Permissions,
} from "@/app/authentication/permission/data-table-permission-category";
import { columns } from "@/app/authentication/permission/columns";
import { DataTableSkeleton } from "@/app/authentication/permission/data-table-skeleton";
import { NoResultPage, ErrorPage } from "@/app/authentication/error/page";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogPermission } from "./create/dialog";
import { useNavigate } from "react-router-dom";

async function getData(): Promise<Permissions[]> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllPermissions}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export default function Page({ reload }: { reload?: boolean }) {
  const [data, setData] = useState<Permissions[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (reload) {
      getData()
      .then(setData)
      .catch((err) => setError(err.message));
      navigate("/permissions", { state: { reload: false } });
    };
    getData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, [ reload, navigate ]);

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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto text-primary border-primary rounded-full px-6"
            >
              Add New
            </Button>
          </DialogTrigger>
          <DialogPermission />
        </Dialog>
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
