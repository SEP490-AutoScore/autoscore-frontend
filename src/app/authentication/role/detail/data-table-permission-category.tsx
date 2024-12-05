import React from "react";
import { DataTable } from "@/app/authentication/role/detail/data-table";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { createColumns } from "@/app/authentication/role/detail/columns";

export interface Role {
  roleId: number;
  roleName: string;
  roleCode: string;
  description: string | null;
  status: boolean;
  permissionsCategory: Permissions[];
}

export interface Permission {
  permissionId: number;
  action: string;
  permissionName: string;
  description: string | null;
  status: boolean;
}

export interface Permissions {
  permissionCategoryId: number;
  permissionCategoryName: string;
  status: boolean;
  permissions: Permission[];
}

interface PermissionCategoryTableProps {
  category: Permissions;
  roleId: number;
  roleCode: string;
}

const PermissionCategoryTable: React.FC<PermissionCategoryTableProps> = ({
  category,
  roleId,
  roleCode,
}) => {
  const navigate = useNavigate();
  const showToast = useToastNotification();
  const token = localStorage.getItem("jwtToken");

  const handleUpdateStatus = async (permissionId: number, status: boolean) => {
    try {
      const body = {
        roleId,
        permissionId,
        status,
      };
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.updateRolePermission}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update permission status");
      }

      showToast({
        title: "Updated Successfully",
        description: "Permission status has been updated successfully",
        variant: "default",
      });

      navigate("/roles/detail", { state: { reload: true, id: roleId } });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Updated Failed",
        description: "Failed to update permission status",
        variant: "destructive",
      });
    }
  };

  const columns = createColumns(roleCode, handleUpdateStatus);

  return (
    <div className="mt-6">
      <p className="font-semibold mb-2">{category.permissionCategoryName}</p>
      <DataTable columns={columns} data={category.permissions} />
    </div>
  );
};

export default PermissionCategoryTable;
