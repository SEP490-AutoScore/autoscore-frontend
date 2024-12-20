import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkPermission } from "@/hooks/use-auth";

export type AIApiKey = {
  aiApiKeyId: number;
  aiName: string;
  aiApiKey: string;
  fullName: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  selected: boolean;
  shared: boolean;

};

export async function updateSelectedKey(aiApiKeyId: number): Promise<AIApiKey> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT token not found.");
  }
  const url = `${BASE_URL}${API_ENDPOINTS.updateSelectedKey}?aiApiKeyId=${aiApiKeyId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error updating selected status: ${errorText}`);
  }
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to parse response as JSON: " + error);
  }
};

export async function deleteAIApiKey(aiApiKeyId: number): Promise<void> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT token not found.");
  }
  const url = `${BASE_URL}${API_ENDPOINTS.deleteAIApiKey}/${aiApiKeyId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error deleting API Key: ${errorText}`);
  }
}

export const createColumns = (
  handleSelectKey: (aiApiKeyId: number) => Promise<void>,
  handleDeleteKey: (aiApiKeyId: number) => Promise<void>,
  handleViewDetail: (aiApiKeyId: number) => Promise<void>
): ColumnDef<AIApiKey>[] => {
  return [
    {
      accessorKey: "aiName",
      header: "AI Name",
    },
    {
      accessorKey: "aiApiKey",
      header: "API Key",
      cell: ({ row }) => {
        const apiKey = row.getValue("aiApiKey") as string;
        return <div>{apiKey.slice(0, 15)}...</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
        return <div>{status ? "Active" : "Inactive"}</div>;
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },

    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => {
        const fullName = row.getValue("fullName") as string;
        return <div>{fullName}</div>;
      },
    },

    {
      accessorKey: "shared",
      header: "Shared",
      cell: ({ row }) => {
        const shared = row.getValue("shared") as boolean;
        return <div>{shared ? "Yes" : "No"}</div>;
      },
    },
    {
      accessorKey: "selected",
      header: "Selected",
      cell: ({ row }) => {
        const selected = row.getValue("selected") as boolean;
        return <div>{selected ? "Selected" : ""}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const aiApiKey = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(aiApiKey.aiApiKey)}
              >
                Copy API Key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {checkPermission({ permission: "VIEW_API_KEY" }) && (
                <DropdownMenuItem onClick={() => handleViewDetail(aiApiKey.aiApiKeyId)}>
                  View detail
                </DropdownMenuItem>
              )}
              {checkPermission({ permission: "DELETE_API_KEY" }) && (
                <DropdownMenuItem
                  onClick={() => handleDeleteKey(aiApiKey.aiApiKeyId)}
                >
                  Delete
                </DropdownMenuItem>
              )}
              {checkPermission({ permission: "SELECT_OTHER_KEY" }) && (
                <DropdownMenuItem
                  onClick={() => handleSelectKey(aiApiKey.aiApiKeyId)}
                >
                  Select this key
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};