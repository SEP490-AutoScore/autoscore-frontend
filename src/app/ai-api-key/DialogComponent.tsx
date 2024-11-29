import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";

export const DialogComponent = ({ onClose, open }: { onClose: () => void; open: boolean }) => {
  const [popupData, setPopupData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return; 

    const fetchPopupData = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("JWT token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.showQuestionAskAi}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPopupData(data);
        } else {
          const errorData = await response.json();
          setError(`Error fetching popup data: ${errorData.message}`);
        }
      } catch (error) {
        setError("Error fetching popup data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopupData();
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Question Ask AI</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Information about questions and purposes asked by the AI.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mt-4">
            {error}
          </Alert>
        ) : popupData && popupData.length > 0 ? (
          <div className="overflow-y-auto max-h-96 mt-4">
            <ul className="space-y-4">
              {popupData.map((item) => (
                <li key={item.contentId} className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-bold text-sm mb-2">{item.purpose}</p>
                  <p className="text-sm">{item.questionAskAiContent}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available.</p>
        )}

        <Button onClick={onClose} variant="outline" className="w-full mt-6">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
