import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PostmanForGradingLayout from "./postman-for-grading-layout";
import FunctionTree from "./components/FunctionTree";

// Dữ liệu giả định
const initialData = [
  { id: 1, name: "login", parentId: null },
  { id: 2, name: "get", parentId: 1 },
  { id: 3, name: "getall", parentId: 1 },
  { id: 4, name: "search", parentId: 1 },
  { id: 5, name: "delete", parentId: 1 },
  { id: 6, name: "create", parentId: 1 },
];

// Hàm xây dựng cấu trúc cha-con
function buildTree(data: { id: number; name: string; parentId: number | null }[], parentId: number | null = null) {
  return data
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(data, item.id),
    }));
}

const PostmanForGrading: React.FC = () => {
  const { id } = useParams();
  const [treeData, setTreeData] = useState(buildTree(initialData));

  // Hàm cập nhật cây
  const handleUpdateTree = (newTree: any[]) => {
    setTreeData(newTree);
  };

    // State và hàm xử lý cho dropdown
  const [selectedOption, setSelectedOption] = useState<string>("");
  const fileInfo = {
    name: "example_file.txt",
    createdAt: new Date().toLocaleDateString(),
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
   
  };

  return (
    <PostmanForGradingLayout
      top={<h1 className="text-xl font-bold">Postman For Grading - Paper ID {id}</h1>}
      left={
                <div>
                  <h2 className="text-lg font-semibold">Actions</h2>
                  <select
                    className="w-full p-2 border rounded-lg mt-2"
                    value={selectedOption}
                    onChange={handleChange}
                  >
                    <option value="">Select Action</option>
                    <option value="import">Import</option>
                    <option value="export">Export</option>
                    <option value="merge">Merge</option>
                    <option value="delete">Delete</option>
                  </select>
                  <p className="mt-4 text-sm text-gray-600">
                    <strong>File đã tạo:</strong> {fileInfo.name}
                    <br />
                    <strong>Ngày tạo:</strong> {fileInfo.createdAt}
                  </p>
                </div>
              }
      right={
        <div>
          <h2 className="text-lg font-semibold">Function Hierarchy</h2>
          <FunctionTree tree={treeData} onUpdateTree={handleUpdateTree} />
        </div>
      }
    />
  );
};

export default PostmanForGrading;