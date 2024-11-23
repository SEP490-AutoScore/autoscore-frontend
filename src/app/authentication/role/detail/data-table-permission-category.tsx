import React from "react";
import { DataTable } from "@/app/authentication/role/detail/data-table";
import { ColumnDef } from "@tanstack/react-table";

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
  columns: ColumnDef<Permission>[];
}

const PermissionCategoryTable: React.FC<PermissionCategoryTableProps> = ({
  category,
  columns,
}) => {
  return (
    <div className="mt-6">
      <p className="font-semibold mb-2">{category.permissionCategoryName}</p>
      <DataTable columns={columns} data={category.permissions} />
    </div>
  );
};

export default PermissionCategoryTable;
