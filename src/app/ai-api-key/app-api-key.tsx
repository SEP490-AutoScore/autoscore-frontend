import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/app/ai-api-key/data-table";
import { AIApiKey, createColumns, updateSelectedKey } from "@/app/ai-api-key/columns";

import { DialogComponent } from "@/app/ai-api-key/DialogComponent";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { AIApiKeysSkeleton } from "@/app/ai-api-key/ai-api-key-skeleton";
import { Button } from "@/components/ui/button";
import { CreateKeyDialog } from "@/app/ai-api-key/CreateKeyDialog";

export async function getAIApiKeys(): Promise<AIApiKey[]> {


  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("JWT token not found.");
  }

  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.aiApiKeys}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error fetching API keys: ${errorData.message}`);
  }

  const data = await response.json();

  return data.map((item: AIApiKey) => ({
    aiApiKeyId: item.aiApiKeyId,
    aiName: item.aiName,
    aiApiKey: item.aiApiKey,
    fullName: item.fullName,
    status: item.status,
    createdAt: item.createdAt || "N/A",
    updatedAt: item.updatedAt || "N/A",
    shared: item.shared,
    selected: item.selected,
  }));
}
export default function AIApiKeysPage() {
  const [data, setData] = useState<AIApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const fetchedData = await getAIApiKeys();
      setData(fetchedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectKey = useCallback(async (aiApiKeyId: number) => {
    try {
      await updateSelectedKey(aiApiKeyId);
      setData((prevData) =>
        prevData.map((key) =>
          key.aiApiKeyId === aiApiKeyId ? { ...key, selected: true } : { ...key, selected: false }
        )
      );
    } catch (error) {
      console.error("Error selecting key:", error);
      fetchData();
    }
  }, [fetchData]);

  const columns = createColumns(handleSelectKey);

  if (loading) {
    return <AIApiKeysSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex justify-end gap-x-2">


        <Button variant="outline" onClick={() => setShowDialog(true)}>
          Show question ask AI
        </Button>


        <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
          Create new key
        </Button>
      </div>

      <DataTable columns={columns} data={data} />

      <DialogComponent open={showDialog} onClose={() => setShowDialog(false)} />

      {showCreateDialog && (
        <CreateKeyDialog
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false); 
            fetchData(); 
          }}
        />
      )}

    </div>

  );
}
