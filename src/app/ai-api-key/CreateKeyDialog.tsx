import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

export const CreateKeyDialog = ({ onClose, open }: { onClose: () => void; open: boolean }) => {
  const notify = useToastNotification();
  const [form, setForm] = useState({
    aiName: "GEMINI",
    aiApiKey: "",
    shared: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.aiApiKey.trim()) {
      notify({
        title: "Error",
        description: "API Key cannot be empty!",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("JWT token not found.");
        return;
      }

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.createAiApiKeys}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.aiApiKeyId) {
          notify({
            title: "Success",
            description: `API Key created successfully! ID: ${responseData.aiApiKeyId}`,
            variant: "default",
          });
        }
        onClose();
      } else {
        const errorData = await response.json();
        notify({
          title: "Error",
          description: errorData.message || "Failed to create API Key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating API Key:", error);
      notify({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New API Key</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details below to create a new API Key.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* AI Name */}
          <div>
            <label className="block text-sm font-medium">AI Name</label>
            <input
              type="text"
              name="aiName"
              value={form.aiName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              disabled
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium">API Key</label>
            <input
              type="text"
              name="aiApiKey"
              value={form.aiApiKey}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter API Key"
            />
          </div>

          {/* Is Shared */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="shared"
              checked={form.shared}
              onChange={handleChange}
              id="shared-checkbox"
              className="peer h-5 w-5 border-2 border-gray-300 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all duration-200"
            />
            <label
              htmlFor="shared-checkbox"
              className="text-sm peer-checked:text-orange-500 transition-all duration-200"
            >
              Is Shared
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
