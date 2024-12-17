import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/app/ai-api-key/data-table";
import { AIApiKey, createColumns, updateSelectedKey, deleteAIApiKey } from "@/app/ai-api-key/columns";
import { DialogComponent } from "@/app/ai-api-key/DialogComponent";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { AIApiKeysSkeleton } from "@/app/ai-api-key/ai-api-key-skeleton";
import { Button } from "@/components/ui/button";
import { CreateKeyDialog } from "@/app/ai-api-key/CreateKeyDialog";
import { useToastNotification } from "@/hooks/use-toast-notification";
import ViewDetailDialog from "./AIApiKeyDetail";
import { checkPermission } from "@/hooks/use-auth";

export async function getAIApiKeys(): Promise<AIApiKey[]> {
  const token = localStorage.getItem("jwtToken");
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
  const notify = useToastNotification();
  const [viewDetailDialogOpen, setViewDetailDialogOpen] = useState(false);
  const [selectedAiApiKeyId, setSelectedAiApiKeyId] = useState<number | null>(null);
  const handleViewDetail = async (aiApiKeyId: number): Promise<void> => {
    setSelectedAiApiKeyId(aiApiKeyId);
    setViewDetailDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setViewDetailDialogOpen(false);
  };
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
        ));
      notify({
        title: "Successfully",
        description: "Select key successfully!",
        variant: "default",
      });
    } catch (error) {
      notify({
        title: "Successfully",
        description: "Select key successfully!",
        variant: "default",
      });
      fetchData();
    }
  }, [fetchData]);

  const handleDeleteKey = useCallback(async (aiApiKeyId: number) => {
    try {
      await deleteAIApiKey(aiApiKeyId);
      setData((prevData) => prevData.filter((key) => key.aiApiKeyId !== aiApiKeyId));
      notify({
        title: "Successfully",
        description: "Successfully!",
        variant: "default",
      });
    } catch (error) {
      notify({
        title: "Failure",
        description: "You are not owned this key",
        variant: "destructive",
      });
    }
  }, []);

  const columns = createColumns(handleSelectKey, handleDeleteKey, handleViewDetail);
  if (loading) {
    return <AIApiKeysSkeleton />;
  }
  return (
    <div className="container mx-auto">
      <div className="mb-4 flex justify-end gap-x-2">
        {checkPermission({ permission: "VIEW_GHERKIN_POSTMAN" }) && (
          <Button variant="outline" onClick={() => setShowDialog(true)}>
            Show AI Prompt
          </Button>
        )}
        {checkPermission({ permission: "CREATE_API_KEY" }) && (
          <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
            Create New AI Key
          </Button>
        )}
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
      {selectedAiApiKeyId !== null && (
        <ViewDetailDialog
          aiApiKeyId={selectedAiApiKeyId}
          open={viewDetailDialogOpen}
          onClose={handleCloseDialog}
          onUpdateSuccess={fetchData}
        />
      )}
    </div>
  );
}
