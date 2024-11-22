import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostmanForGradingLayout from "./postman-for-grading-layout";
import FunctionTree from "./components/FunctionTree";
import { buildTree } from "./components/treeUtils"; // Ensure this utility is correctly implemented

// Mock data
const initialData = [
  { id: 0, functionName: "hidden", parentId: 0, orderPriority: 0, totalTestCase: 0, score: 0 },
  { id: 100, functionName: "login by admin", parentId: 0, orderPriority: 1, totalTestCase: 3, score: 2.5 },
  { id: 11, functionName: "get", parentId: 100, orderPriority: 2, totalTestCase: 2, score: 2.5 },
  { id: 12, functionName: "get all", parentId: 11, orderPriority: 3, totalTestCase: 2, score: 2 },
  { id: 13, functionName: "search", parentId: 11, orderPriority: 4, totalTestCase: 2, score: 2.5 },
  { id: 14, functionName: "delete by admin", parentId: 11, orderPriority: 5, totalTestCase: 2, score: 3 },
  { id: 15, functionName: "create", parentId: 11, orderPriority: 6, totalTestCase: 2, score: 2 },
];

const PostmanForGrading: React.FC = () => {
  const { id } = useParams();

  // Initialize treeData using buildTree. Assumes root node has `parentId = 0`.
  const [treeData, setTreeData] = useState(buildTree(initialData, 0)); 
  const [initialTreeData, setInitialTreeData] = useState(treeData); // Store the initial tree data
  const [selectedAction, setSelectedAction] = useState("");  // State to control selected action in <select>

  // Function to handle tree updates
  const handleUpdateTree = (newTree: any[]) => {
    setTreeData(newTree);
      };

  // Function to handle Save Tree action
  const handleSaveTree = () => {
    console.log("Saving Tree Data...");
        // Log all the updated nodes
    const logTree = (nodes: any[]) => {
      nodes.forEach((node) => {
        console.log({
          id: node.id,
          parentId: node.parentId,
          score: node.score,
          functionName: node.functionName,
        });
        if (node.children && node.children.length > 0) {
          logTree(node.children);  // Recursively log the children
        }
      });
    };
    logTree(treeData);  // Call the logging function for the root tree
    
    setInitialTreeData(treeData);  // Update initialTreeData to the current tree state
    
    // Reset the selected action to the default option
    setSelectedAction("");  // Reset the select value to default
  };
  

  // Function to reset the parentId of all nodes to 0 based on initialData
  const resetParentId = () => {
    // Create a deep copy of initialData to avoid mutation
    const resetTree = initialData.map(node => ({
      ...node,  // Keep all properties of the node
      parentId: 0,  // Reset parentId to 0
    }));

    // Rebuild the tree structure after resetting the parentId
    const rebuiltTree = buildTree(resetTree, 0);  // Rebuild the tree from the modified data
    setTreeData(rebuiltTree);  // Update the tree
    setInitialTreeData(rebuiltTree);  // Reset the initial tree data to reflect the changes
    setSelectedAction("");  // Reset the select value to default after reset
  };

  // Use useEffect to detect changes in treeData and update isSaved status
  useEffect(() => {
   
  }, [treeData]);  // This effect will run whenever treeData changes

  return (
    <PostmanForGradingLayout
      top={<h1 className="text-xl font-bold">Postman For Grading - Paper ID {id}</h1>}
      left={
        <div>
          <h2 className="text-lg font-semibold">Actions</h2>
          <select
            className="w-full p-2 border rounded-lg mt-2"
            value={selectedAction}  // Bind the select value to the state
            onChange={(e) => {
              const action = e.target.value;
              setSelectedAction(action);  // Update the selected action
              if (action === "save") {
                handleSaveTree();  // Handle the Save Tree action
              } else if (action === "reset") {
                resetParentId();  // Reset Parent ID action
              }
            }}
          >
            <option value="">Select Action</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
            <option value="merge">Merge</option>
            <option value="delete">Delete</option>
            <option value="save" >Save Tree</option>
            <option value="reset">Reset Parent ID</option> {/* Add Reset Parent ID option */}
          </select>
          <p className="mt-4 text-sm text-gray-600">
            <strong>Note:</strong> Use the above options to manage tree data.
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
