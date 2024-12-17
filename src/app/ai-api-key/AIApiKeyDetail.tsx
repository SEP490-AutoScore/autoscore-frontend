// ViewDetailDialog.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { checkPermission } from "@/hooks/use-auth";

type ViewDetailDialogProps = {
  aiApiKeyId: number;
  open: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
};

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

const ViewDetailDialog = ({ aiApiKeyId, open, onClose, onUpdateSuccess }: ViewDetailDialogProps) => {
  const [aiApiKey, setAiApiKey] = useState<AIApiKey | null>(null);
  const [shared, setShared] = useState<boolean>(false);
  const notify = useToastNotification();

  const fetchApiKeyDetail = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      notify({
        title: "Error",
        description: "JWT token not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getAIApiKeyDetail}/${aiApiKeyId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAiApiKey(data);

        setShared(data.shared);

      } else {
        const errorData = await response.json();
        notify({
          title: "Error",
          description: errorData.message || "Failed to fetch API Key details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching API Key details:", error);
      notify({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !aiApiKey) {
      notify({
        title: "Error",
        description: "JWT token or aiApiKey not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        shared: shared.toString(),
      });
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.updateAiApiKey}/${aiApiKeyId}?${queryParams.toString()}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
      );
      if (response.ok) {
        notify({
          title: "Success",
          description: "API Key updated successfully.",
          variant: "default",
        });
        onUpdateSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        notify({
          title: "Error",
          description: errorData.message || "Failed to update API Key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating API Key:", error);
      notify({
        title: "Error",
        description: "You are not own this key",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (open && aiApiKeyId) {
      fetchApiKeyDetail();
    }
  }, [open, aiApiKeyId]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">API Key Details</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Here are the details for the selected API key.
          </DialogDescription>
        </DialogHeader>
        {aiApiKey ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">AI Name</label>
              <input
                type="text"
                value={aiApiKey.aiName}
                disabled
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">API Key</label>
              <input
                type="text"
                disabled
                value={aiApiKey.aiApiKey ? `${aiApiKey.aiApiKey.slice(0, 15)}...` : ""}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Shared</label>
              <input
                type="checkbox"
                checked={shared}
                onChange={(e) => setShared(e.target.checked)}
                className="peer h-5 w-5 border-2 border-gray-300 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Created At</label>
              <input
                type="text"
                value={aiApiKey.createdAt ? new Date(aiApiKey.createdAt).toLocaleString() : "N/A"}
                disabled
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Updated At</label>
              <input
                type="text"
                value={aiApiKey.updatedAt ? new Date(aiApiKey.updatedAt).toLocaleString() : "N/A"}
                disabled
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
        ) : (
          <div className="text-red-500">Loading...</div>
        )}
        <div className="mt-6 flex justify-end space-x-2">
          {checkPermission({ permission: "UPDATE_API_KEY" }) && (
            <Button variant="default" onClick={handleSave}>
              Save
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailDialog;