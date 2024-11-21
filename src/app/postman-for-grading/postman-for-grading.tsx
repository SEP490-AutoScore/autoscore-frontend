import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PostmanForGradingLayout from "./postman-for-grading-layout";
import FunctionTree from "./components/FunctionTree";

// Dữ liệu giả định
const initialData = [
  { id: 1, name: "login", parentIds: [] }, // Không có cha (root)
  { id: 2, name: "get", parentIds: [1] }, // Thuộc "login"
  { id: 3, name: "get all", parentIds: [2, 1] }, // Thuộc cả "get" và "login"
  { id: 4, name: "search", parentIds: [1] },
  { id: 5, name: "delete for admin", parentIds: [1] },
  { id: 6, name: "create", parentIds: [] }, // Cũng là root
];


// Hàm xây dựng cấu trúc cây

function buildTree(data, parentId = null) {
  const nodes = data.filter(item =>
    parentId === null ? item.parentIds.length === 0 : item.parentIds.includes(parentId)
  );
  return nodes.map(node => ({
    ...node,
    children: buildTree(data, node.id),
  }));
}


const PostmanForGrading: React.FC = () => {
  const { id } = useParams();
  const [treeData, setTreeData] = useState(buildTree(initialData));

  
  const handleUpdateParent = (nodeId, newParentId) => {
    const updatedData = updateParent(initialData, nodeId, newParentId);
    setTreeData(buildTree(updatedData));
  };
  

  // State và hàm xử lý cho dropdown
  const [selectedOption, setSelectedOption] = useState<string>("");
  const fileInfo = {
    name: "example_file.txt",
    createdAt: new Date().toLocaleDateString(),
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    console.log(`Selected option: ${event.target.value}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          <FunctionTree
            tree={treeData}
            onUpdateParent={handleUpdateParent}
          />
        </div>
      }
     
    /> 
    </DndProvider>
  );
};

export default PostmanForGrading;
