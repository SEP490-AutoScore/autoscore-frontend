import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./form";
import { useEffect, useState } from "react";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";

export function DialogUpdateOrganization({
  organizationId,
}: {
  organizationId: number;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [parentId, setParentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Bắt đầu tải
    fetch(
      `${BASE_URL}${API_ENDPOINTS.getOrganizationDetail}${organizationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const { name, type, parentId } = res;
        setName(name || "");
        setType(type || "");
        setParentId(parentId || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false)); // Dừng trạng thái tải
  }, [organizationId]);

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <div>Loading...</div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          Update {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </DialogTitle>
        <DialogDescription>
          Update{" "}
          <span className="font-semibold text-primary">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
          </span> information.
        </DialogDescription>
      </DialogHeader>
      <OrganizationForm
        organizationId={organizationId}
        name={name}
        type={type}
        parentId={parentId}
      />
    </DialogContent>
  );
}
