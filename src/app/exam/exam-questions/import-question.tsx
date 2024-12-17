import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import UploadImage from "@/assets/upload.png";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { FolderUp } from "lucide-react";
import { checkPermission } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface ImportWordDialogProps {
  examPaperId: number; // Nhận examPaperId dưới dạng prop
}

const ImportWordDialog: React.FC<ImportWordDialogProps> = ({ examPaperId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "doc" || fileExtension === "docx") {
        setSelectedFile(file);
        setErrorMessage(null);
      } else {
        setErrorMessage("Vui lòng chọn tệp .doc hoặc .docx hợp lệ.");
      }
    }
  };
  const token = localStorage.getItem("jwtToken");

  const showToast = useToastNotification();
  const hasPermission = checkPermission({ permission: "CREATE_QUESTION" });
  if (!hasPermission) {
    return <></>;
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setErrorMessage("Vui lòng chọn tệp để tải lên.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.importExamQuestion}?examPaperId=${examPaperId}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // Thêm JWT vào header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải tệp lên. Vui lòng thử lại.");
      }

      showToast({
        title: "Import success",
        description: "Import questions success",
        variant: "default",
      });
      navigate(0);
      setIsOpen(false);
      setSelectedFile(null);
    } catch (error) {
      showToast({
        title: "Import fail!",
        description: "Import questions fail!",
        variant: "destructive",
      });
      setErrorMessage(
        error instanceof Error ? error.message : "Đã xảy ra lỗi."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
            >
              <FolderUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import Exam Questions</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Quest From Word</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            {/* upload file */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary">
              <input
                type="file"
                accept=".doc,.docx"
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
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  {selectedFile.name} (
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            {/* Describe */}
            <div className="flex justify-between">
              <DialogDescription>
                Supported formats: .doc/.docx
              </DialogDescription>
              <DialogDescription>Maximum size: 25MB</DialogDescription>
            </div>

            {/* Progress bar hoặc trạng thái upload */}
            {isUploading && (
              <div className="text-sm text-primary font-medium">
                Uploading...
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              className="bg-primary text-white hover:bg-orange-500"
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportWordDialog;
