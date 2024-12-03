import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const checkPermission = ({ permission } : { permission: string }): boolean => {
  const permissions = localStorage.getItem("permissions");
  if (!permissions) return false;
  if (permission === "ALL_ACCESS") return true;

  const permissionsArray = permissions.split(",").map((perm) => perm.trim());
  return permissionsArray.includes(permission);
}