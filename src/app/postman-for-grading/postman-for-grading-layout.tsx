import React, { useState, useRef } from "react";

interface LayoutProps {
  top?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const PostmanForGradingLayout: React.FC<LayoutProps> = ({ top, left, right }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);  // Tạo ref cho input file

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value;
    setSelectedOption(option);

    // Khi chọn "Import", gọi trình tải file lên
    if (option === "import" && fileInputRef.current) {
      fileInputRef.current.click();  // Kích hoạt input file
    }

    // Thực hiện hành động khác khi chọn các tùy chọn khác
    switch (option) {
      case "export":
        console.log("Export action selected");
        break;
      case "merge":
        console.log("Merge action selected");
        break;
      case "delete":
        console.log("Delete action selected");
        break;
      default:
        break;
    }
  };

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];  // Lấy file đã chọn
    if (file) {
      console.log("File selected:", file.name);
      // Xử lý file ở đây (ví dụ: upload file)
    }
  };

  // Thông tin về file (có thể được lấy động từ một API hoặc state khác)
  const fileInfo = {
    name: "example_file.txt",
    createdAt: new Date().toLocaleDateString(),  // Định dạng ngày tạo
  };

  return (
    <div className="h-screen flex flex-col">
      {top && <div className="bg-gray-100 p-4">{top}</div>}

      <div className="flex flex-1">
        <div className="w-1/4 p-4 border-r">
          {/* Dropdown list */}
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="">Select Action</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
            <option value="merge">Merge</option>
            <option value="delete">Delete</option>
          </select>

          {/* Thêm thông tin file dưới dropdown list */}
          <p className="mt-4 text-sm text-gray-600">
            <strong>File đã tạo:</strong> {fileInfo.name}
            <br />
            <strong>Ngày tạo:</strong> {fileInfo.createdAt}
          </p>

          {/* Thêm input file ẩn, chỉ kích hoạt khi "Import" được chọn */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="w-3/4 p-4">{right}</div>
      </div>
    </div>
  );
};

export default PostmanForGradingLayout;
