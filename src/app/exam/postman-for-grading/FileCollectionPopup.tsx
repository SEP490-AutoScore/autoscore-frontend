import React from "react";
import { Button } from "@/components/ui/button";  // Assuming Button component is from your UI library


interface FileCollectionPopupProps {
  fileCollectionPostman: string | null;
  onClose: () => void;
}

const FileCollectionPopup: React.FC<FileCollectionPopupProps> = ({
  fileCollectionPostman,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full resize overflow-auto min-h-[200px] max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">File Collection Postman Data</h2>
        <p className="text-sm text-gray-700">
          <strong className="font-semibold">File Collection Value:</strong>
          {fileCollectionPostman !== null ? fileCollectionPostman : "No data available"}
        </p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default FileCollectionPopup;
