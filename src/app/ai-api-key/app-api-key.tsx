import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/app/ai-api-key/data-table";
import { AIApiKey, createColumns, updateSelectedKey } from "@/app/ai-api-key/columns";

import  {PopupComponent} from "@/app/ai-api-key/PopupComponent";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { AIApiKeysSkeleton } from "@/app/ai-api-key/ai-api-key-skeleton";
import { Button } from "@/components/ui/button";

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
    createAt: item.createdAt || "N/A",
    updateAt: item.updatedAt || "N/A",
    shared: item.shared,
    selected: item.selected,
  }));
}

export default function AIApiKeysPage() {
  const [data, setData] = useState<AIApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [popupData, setPopupData] = useState(null); 
  const [showPopup, setShowPopup] = useState(false); 

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

  const fetchPopupData = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("JWT token not found.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/content", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPopupData(data);
        setShowPopup(true); // Show popup
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching popup data:", error);
    }
  };


  const handleSelectKey = useCallback(async (aiApiKeyId: number) => {
    try {
      await updateSelectedKey(aiApiKeyId, true);
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
      {/* Nút Show question ask AI */}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={fetchPopupData}>
          Show question ask AI
        </Button>
      </div>

      {/* Bảng DataTable */}
      <DataTable columns={columns} data={data} />

      {/* Popup */}
      {showPopup && (
        <PopupComponent data={popupData} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
