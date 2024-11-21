import React, { useState } from "react";

// Định nghĩa giao diện cho dữ liệu node
interface TreeNode {
  id: number;
  name: string;
  parentId: number | null;
  children: TreeNode[];
}

// Hàm xây dựng cấu trúc cây lồng ghép
function buildTree(data: TreeNode[], parentId: number | null = null): TreeNode[] {
  return data
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(data, item.id),
    }));
}

// Component hiển thị cây cha-con
const FunctionTree: React.FC<{ tree: TreeNode[]; onUpdateTree: (newTree: TreeNode[]) => void }> = ({ tree, onUpdateTree }) => {
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  // Hàm tìm và cập nhật parentId khi di chuyển node
  const updateParentId = (data: TreeNode[], draggedId: number, newParentId: number | null): TreeNode[] => {
    return data.map(node => ({
      ...node,
      parentId: node.id === draggedId ? newParentId : node.parentId,
    }));
  };

  // Hàm xử lý khi bắt đầu kéo
  const handleDragStart = (id: number) => {
    setDraggedNodeId(id);
  };

  // Hàm xử lý khi kéo kết thúc
  const handleDrop = (targetId: number | null) => {
    if (draggedNodeId !== null && draggedNodeId !== targetId) {
      const flatTree = flattenTree(tree); // Chuyển đổi cây hiện tại thành danh sách phẳng
      const updatedTree = updateParentId(flatTree, draggedNodeId, targetId);
      onUpdateTree(buildTree(updatedTree)); // Xây dựng lại cây từ danh sách phẳng đã cập nhật
    }
    setDraggedNodeId(null);
  };

  // Chuyển đổi cây lồng ghép thành danh sách phẳng
  const flattenTree = (nodes: TreeNode[], parentId: number | null = null): TreeNode[] => {
    return nodes.reduce(
      (acc, node) => [
        ...acc,
        { ...node, children: [], parentId },
        ...flattenTree(node.children, node.id),
      ],
      [] as TreeNode[]
    );
  };

  // Hàm xử lý khi click chọn node
  const handleSelect = (id: number) => {
    setSelectedNodeId(id === selectedNodeId ? null : id); // Bỏ chọn nếu click lại node đã chọn
  };

  // Render động cây cha-con
  const renderTree = (nodes: TreeNode[]) => {
    return (
      <ul className="ml-4 list-disc">
        {nodes.map(node => (
          <li key={node.id} className="mt-2">
            <div
              className={`p-2 rounded-lg cursor-pointer border ${
                draggedNodeId === node.id
                  ? "bg-orange-200"
                  : selectedNodeId === node.id
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              draggable
              onClick={() => handleSelect(node.id)} // Xử lý khi click vào node
              onDragStart={() => handleDragStart(node.id)}
              onDragOver={e => e.preventDefault()} // Cho phép thả vào
              onDrop={() => handleDrop(node.id)} // Khi thả vào node hiện tại
            >
              <span className="font-semibold">{node.name}</span>
            </div>
            {node.children.length > 0 && renderTree(node.children)}
          </li>
        ))}
        {nodes.length === 0 && (
          <li>
            <div
              className="p-2 rounded-lg cursor-pointer border-dashed border-2 border-gray-300"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(null)} // Thả vào danh sách rỗng
            >
              Drop here to make this a root node
            </div>
          </li>
        )}
      </ul>
    );
  };

  return <>{renderTree(tree)}</>;
};

export default FunctionTree;
