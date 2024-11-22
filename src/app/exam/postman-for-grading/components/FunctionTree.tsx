import React, { useState } from "react";
import { TreeNode } from "./treeUtils"; // Ensure the correct import
import { buildTree } from "./treeUtils";

// The FunctionTree component
const FunctionTree: React.FC<{
  tree: TreeNode[];  // Expecting the tree to be an array of TreeNode
  onUpdateTree: (newTree: TreeNode[]) => void;  // Callback for updating the tree
}> = ({ tree, onUpdateTree }) => {
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  // Function to update the parentId of a node when it's dragged and dropped
  const updateParentId = (data: TreeNode[], draggedId: number, newParentId: number): TreeNode[] => {
    return data.map(node => {
      if (node.id === draggedId) {
        // Update the parentId of the dragged node
        return { ...node, parentId: newParentId };
      }
      // If the node has children, recurse through them to update their parentId
      if (node.children) {
        node.children = updateParentId(node.children, draggedId, newParentId);
      }
      return node;
    });
  };

  // Function to update the score of a specific node
  const updateScore = (data: TreeNode[], nodeId: number, newScore: number): TreeNode[] => {
    return data.map(node => ({
      ...node,
      score: node.id === nodeId ? newScore : node.score,
      children: updateScore(node.children, nodeId, newScore),  // Recurse for children
    }));
  };

  // Handle the start of a drag event
  const handleDragStart = (id: number) => {
    setDraggedNodeId(id);
  };

  // Handle the drop event on a target node
  const handleDrop = (targetId: number) => {
    if (draggedNodeId !== null && draggedNodeId !== targetId) {
      const flatTree = flattenTree(tree); // Flatten the tree for easier updates
      const updatedFlatTree = updateParentId(flatTree, draggedNodeId, targetId);
      onUpdateTree(buildTree(updatedFlatTree, 0)); // Rebuild the tree after update
    }
    setDraggedNodeId(null);
  };

  // Flatten the tree into a flat list for easier manipulation
  const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce(
      (acc, node) => [
        ...acc,
        { 
          ...node, 
          children: [],  // Remove children references in the flat list, but keep other properties like `functionName`
        },
        ...flattenTree(node.children),  // Flatten the children as well
      ],
      [] as TreeNode[] // Type assertion to ensure we return an array of TreeNode[]
    );
  };

  // Handle score change for a specific node
  const handleScoreChange = (nodeId: number, newScore: number) => {
    const updatedTree = updateScore(tree, nodeId, newScore);
    onUpdateTree(updatedTree);
  };

  // Handle selection of a node
  const handleSelect = (id: number) => {
    setSelectedNodeId(id === selectedNodeId ? null : id);  // Toggle selection
  };

  // Render the tree structure recursively
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
              onClick={() => handleSelect(node.id)}  // Select the node on click
              onDragStart={() => handleDragStart(node.id)}  // Start dragging the node
              onDragOver={e => e.preventDefault()}  // Allow drop over the node
              onDrop={() => handleDrop(node.id)}  // Handle drop event
            >
              <span className="font-semibold">{node.functionName}</span> {/* Changed from `name` to `functionName */}
              <span className="ml-2 text-sm text-gray-600">({node.totalTestCase} test cases)</span> {/* Show totalTestCase */}
              <span className="ml-2 text-sm text-gray-600"> (Parent ID: {node.parentId})</span> {/* Show Parent ID */}
              <span className="ml-2 text-sm text-gray-600"> (ID: {node.id})</span> {/* Show the Node ID */}
              <div className="mt-2 flex items-center">
                {/* Editable score input */}
                <input
                  type="number"
                  value={node.score}
                  className="ml-4 p-1 border rounded w-16"
                  onChange={(e) => handleScoreChange(node.id, parseFloat(e.target.value))}  // Update score
                />
              </div>
            </div>
            {node.children.length > 0 && renderTree(node.children)}  {/* Recursively render children */}
          </li>
        ))}
      </ul>
    );
  };

  return <>{renderTree(tree)}</>;
};

export default FunctionTree;
