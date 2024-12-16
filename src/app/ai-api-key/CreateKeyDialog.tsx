import React, { useState, useEffect  } from "react";
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
    aiName: "",
    aiApiKey: "",
    shared: false,
  });
  const [aiNames, setAiNames] = useState<string[]>([]);


 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
  
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      // Handle checkbox specifically
      setForm((prev) => ({
        ...prev,
        [target.name]: target.checked, // `checked` is valid for checkboxes
      }));
    } else {
      // Handle other input types like text or select
      setForm((prev) => ({
        ...prev,
        [target.name]: target.value, // `value` is valid for text and select
      }));
    }
  };
  
  


  useEffect(() => {
    const fetchAINames = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          alert("JWT token not found.");
          return;
        }
  
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllAINames}`, {
          method: "GET",  // Proper placement of the method
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setAiNames(data);  // Store AI Names in the state
          setForm((prev) => ({
            ...prev,
            aiName: data[0],  // Set the first AI name as the default value
          }));
        } else {
          notify({
            title: "Error",
            description: "Failed to fetch AI names.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching AI names:", error);
        notify({
          title: "Error",
          description: "An unexpected error occurred while fetching AI names.",
          variant: "destructive",
        });
      }
    };
  
    if (open) {
      fetchAINames();  // Fetch AI names when the dialog is open
    }
  }, [open, notify]);
  

  const handleSubmit = async () => {
    if (!form.aiApiKey.trim()) {
      notify({
        title: "Error",
        description: "API Key cannot be empty!",
        variant: "destructive",
      });
      return;
    }
  
    const payload = {
      ...form,
      shared: form.shared ?? false, 
    };
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
        body: JSON.stringify(payload),
       
      });
      
      if (response.ok) {
        const responseText = await response.text(); 

        if (responseText === "Create successfully") {
          notify({
            title: "Success",
            description: "API Key created successfully!",
            variant: "default",
          });
          onClose(); // Đóng dialog sau khi thành công
        } else {
          notify({
            title: "Warning",
            description: responseText || "Unexpected response received.",
            variant: "destructive",
          });
        }
      } else {
        // Xử lý lỗi khi response không OK
        const errorText = await response.text(); // Có thể nhận lỗi dạng plain text
        notify({
          title: "Error",
          description: errorText || "Failed to create API Key.",
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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
            <select
              name="aiName"
              value={form.aiName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              {aiNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
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
