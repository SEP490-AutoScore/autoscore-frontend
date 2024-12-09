"use client";

import React, { useState } from "react";
import UploadImage from "@/assets/upload.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";

interface ImpostFilePostmanPopupProps {
  onClose: () => void;
  examPaperId: number;
}

const ImpostFilePostmanPopup: React.FC<ImpostFilePostmanPopupProps> = ({
  onClose,
  examPaperId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const showToast = useToastNotification();
  const token = localStorage.getItem("jwtToken");

  // Hàm upload file
  const importFile = async (selectedFile: File) => {
    if (!token) {
      showToast({
        title: "Authentication Error",
        description: "You are not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    if (!examPaperId) {
      showToast({
        title: "Missing Exam Paper ID",
        description: "Cannot upload file without a valid Exam Paper ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("examPaperId", examPaperId.toString());

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.importPostmanCollections}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.text();
        if (result === "Files imported and validated successfully.") {
          showToast({
            title: "Successfully",
            description: "File imported successfully.",
            variant: "default",
          });
          window.location.reload();
          onClose(); 
        } else {
          showToast({
            title: "Unexpected Response",
            description: `Response: ${result}`,
            variant: "default",
          });
        }
      } else {
        const errorText = await response.text();
        showToast({
          title: "Import Failed",
          description: `Error: ${errorText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      showToast({
        title: "Upload Error",
        description: "An error occurred while importing the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await importFile(selectedFile);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Import Postman File
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {/* upload file */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary">
            <input
              type="file"
              accept=".json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isUploading} 
            />
            <div className="w-full flex justify-center mb-4">
              <img src={UploadImage} alt="Upload" className="w-20 h-fit" />
            </div>
            <p className="text-gray-500">
              Drag & Drop or{" "}
              <span className="text-primary font-medium cursor-pointer">
                Choose file
              </span>
            </p>
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
          </div>

          {/* Describe */}
          <div className="flex justify-between">
            <DialogDescription>Supported formats: .json</DialogDescription>
            <DialogDescription>Maximum size: 25MB</DialogDescription>
          </div>

          {/* Progress bar hoặc trạng thái upload */}
          {isUploading && (
            <div className="text-sm text-primary font-medium">
              Uploading...
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-2">
          <Button
            className="bg-white text-primary border border-primary hover:bg-primary hover:text-white"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImpostFilePostmanPopup;
