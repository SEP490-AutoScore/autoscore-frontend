"use client";

import React, { useState, useEffect } from "react";
import UploadImage from "@/assets/upload.png";
import ExcelIcon from "@/assets/excel-icon.png";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useNavigate } from "react-router-dom";

interface FileUploadPopoverProps {
  onClose: () => void;
  examId: number;
}

const FileUploadPopover: React.FC<FileUploadPopoverProps> = ({
  onClose,
  examId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0); // Giá trị thanh Progress
  const [isUploading, setIsUploading] = useState(false); // Trạng thái đang upload
  const showToast = useToastNotification();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (isUploading) {
      const eventSource = new EventSource(
        `${BASE_URL}${API_ENDPOINTS.uploadProcess}` // API nhận tiến trình từ server qua SSE
      );

      eventSource.onmessage = (event) => {
        const progressFromServer = Number(event.data); // Nhận tiến trình từ server
        setProgress(progressFromServer); // Cập nhật tiến trình hiển thị
        console.log("Progress from server:", progressFromServer);
        if (progressFromServer >= 100) {
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => eventSource.close();
    }
  }, [isUploading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProgress(0); // Reset progress về 0
      setIsUploading(true); // Bắt đầu upload
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Gọi hàm upload ngay khi file được chọn
      await uploadFile(selectedFile); // Gọi hàm upload
    }
  };

  const uploadFile = async (selectedFile: File) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        await axios.post(
          `${BASE_URL}${API_ENDPOINTS.uploadStudents}?examId=${examId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        showToast({
          title: "Success",
          description: "File uploaded successfully",
          variant: "default",
        });
        onClose();
        navigate("/exams/exam-papers", { state: { examId, onReload: true } });
      } catch (error) {
        console.error("Error uploading file:", error);
        showToast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false); // Kết thúc trạng thái upload
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Upload Students
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {/* Khu vực upload file */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary">
            <input
              type="file"
              accept=".xls,.xlsx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
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

          {/* Phần mô tả */}
          <div className="flex justify-between">
            <DialogDescription>Supported formats: XLS, XLSX.</DialogDescription>
            <DialogDescription>Maximum size: 25MB</DialogDescription>
          </div>

          {/* Khu vực progress bar */}
          {file && (
            <div className="relative w-full bg-gray-100 p-4 rounded-lg">
              {/* Icon Excel + tên file */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-white border-2 rounded-md flex items-center justify-center">
                  <img src={ExcelIcon} alt="Excel Icon" className="w-10" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {file.name}
                </span>
              </div>
              {/* Thanh progress */}
              <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-green-600 to-green-300 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {progress}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-2">
          <Button
            className="bg-white text-primary border border-primary hover:bg-primary hover:text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadPopover;
