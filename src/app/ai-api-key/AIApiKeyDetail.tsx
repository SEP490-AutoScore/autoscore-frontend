// ViewDetailDialog.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";


type ViewDetailDialogProps = {
  aiApiKeyId: number;
  open: boolean;
  onClose: () => void;
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

const ViewDetailDialog = ({ aiApiKeyId, open, onClose }: ViewDetailDialogProps) => {
  const [aiApiKey, setAiApiKey] = useState<AIApiKey | null>(null);
  const notify = useToastNotification();

  const fetchApiKeyDetail = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("JWT token not found.");
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
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">API Key</label>
              <input
                type="text"
                value={aiApiKey.aiApiKey}
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={aiApiKey.fullName}
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={aiApiKey.status ? "Active" : "Inactive"}
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Created At</label>
              <input
                type="text"
                value={new Date(aiApiKey.createdAt).toLocaleString()}
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Updated At</label>
              <input
                type="text"
                value={new Date(aiApiKey.updatedAt).toLocaleString()}
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
        ) : (
          <div className="text-red-500">Loading...</div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailDialog;
