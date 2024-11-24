import { useEffect, useState } from "react";
import { DataTable } from "@/app/ai-api-key/data-table";
import { columns } from "@/app/ai-api-key/columns";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { AIApiKeysSkeleton } from "@/app/ai-api-key/ai-api-key-skeleton";

interface AIApiKey {
  aiApiKeyId: number;
  aiName: string;
  aiApiKey: string;
  accountId: number;
  status: boolean;
  createAt: string;
  updateAt: string;
  selected: boolean;
  shared: boolean;
}
const token = localStorage.getItem("jwtToken");

if (!token) {
  throw new Error("JWT token not found.");
}

async function getAIApiKeys() {
 

  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.aiApiKeys}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error fetching API keys: ${errorData.message}`);
  }

  const data = await response.json();
  return data.map((item: any) => ({
    aiApiKeyId: item.aiApiKeyId,
    aiName: item.aiName,
    aiApiKey: item.aiApiKey,
    accountId: item.accountId, 
    status: item.status,
    createAt: item.createdAt || "N/A",
    updateAt: item.updatedAt || "N/A",
    shared: item.shared,
    selected: item.selected
  }));
}


export default function AIApiKeysPage() {
  const [data, setData] = useState<AIApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getAIApiKeys()
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <AIApiKeysSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
