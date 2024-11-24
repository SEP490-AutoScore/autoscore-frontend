import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AIApiKey = {
  aiApiKeyId: number
  aiName: string
  aiApiKey: string
  accountId: number
  status: boolean
  createAt: string
  updateAt: string
  shared: boolean
  selected: boolean
}


const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT token not found.");
  }

  const updateSelectedKey = async (aiApiKeyId: number, selected: boolean) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("JWT token not found.");
    }
  
    const url = `${BASE_URL}${API_ENDPOINTS.updateSelectedKey}?aiApiKeyId=${aiApiKeyId}`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    // Kiểm tra mã trạng thái phản hồi
    if (!response.ok) {
      const errorText = await response.text();  // Đọc phản hồi dưới dạng văn bản
          throw new Error(`Error updating selected status: ${errorText}`);
    }
  
    try {
      const data = await response.json();
      return data;
    } catch (error) {
  
      throw new Error("Failed to parse response as JSON");
    }
  };
  
  

export const columns: ColumnDef<AIApiKey>[] = [
 

  {
    accessorKey: "aiName",
    header: "AI Name",
  },
  {
    accessorKey: "aiApiKey",
    header: "API Key",
    cell: ({ row }) => {
      const apiKey = row.getValue("aiApiKey") as string
      return <div>{apiKey.slice(0, 15)}...</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean
      return <div>{status ? "Active" : "Inactive"}</div>
    },
  },
 

  {
    accessorKey: "createAt",
    header: "Create At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createAt"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "updateAt",
    header: "Update At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updateAt"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "accountId",
    header: "Account",
    cell: ({ row }) => {
      const accountId = row.getValue("accountId") as number;
      return <div>{accountId}</div>;
    },
  }, 
  
  {
    accessorKey: "shared",
    header: "Shared",
    cell: ({ row }) => {
      const shared = row.getValue("shared") as boolean
      return <div>{shared ? "Yes" : "No"}</div>
    },
  },
  {
    accessorKey: "selected",
    header: "Selected",
    cell: ({ row }) => {
      const selected = row.getValue("selected") as boolean
      return <div>{selected ? "Selected" : "No Select"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const aiApiKey = row.original

      const handleSelectKey = async (aiApiKeyId: number) => {
        try {
          // Gọi API để cập nhật trạng thái selected của key
          await updateSelectedKey(aiApiKeyId, true);
      
          // Cập nhật lại dữ liệu trong bảng
          setData((prevData) =>
            prevData.map((key) =>
              key.aiApiKeyId === aiApiKeyId ? { ...key, selected: true } : key
            )
          );
        } catch (error) {
      
        }
      };
      
      

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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelectKey(aiApiKey.aiApiKeyId)}>
  Select this key
</DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]