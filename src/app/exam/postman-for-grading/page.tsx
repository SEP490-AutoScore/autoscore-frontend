import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import { useToastNotification } from "@/hooks/use-toast-notification";
import PostmanForGradingLayout from "./postman-for-grading-layout";
import ImpostFilePostmanPopup from "./import-file-postman";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import FileCollectionDialog from "./FileCollectionDialog";
import LogRunPostmanDialog from "./LogRunPostmanDialog";
import { calculateScores } from "./calculate-scores";
import { fixAuthFilePostman } from "./fixAuthFilePostman";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const Page: React.FC = () => {
  const location = useLocation();
  const { examId, examPaperId } = location.state || {};
  const [postmanData, setPostmanData] = useState<any[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<number>>(new Set());
  const token = localStorage.getItem("jwtToken");
  const [, setSelectedAction] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const notify = useToastNotification();
  const [reloadData, setReloadData] = useState<boolean>(false);
  const nodeRefs = useRef<Record<number, HTMLElement | null>>({});
  const [isConfirmFile, setIsConfirmFile] = useState<boolean | null>(null);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [fileCollectionPostman, setFileCollectionPostman] = useState<string | null>(null);
  const [logRunPostman, setLogRunPostman] = useState<string | null>(null);
  const [showFilePostmanDialog, setShowFilePostmanDialog] = useState<boolean>(false);
  const [showLogRunPostmanDialog, setShowLogRunPostmanDialog] = useState<boolean>(false);

  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: "Exam Details",
    breadcrumbLink_2: "/exams/exam-papers",
    breadcrumbPage_3: "Postman For Grading",
    stateGive: { examId: examId },
  });

  // Function to deselect all nodes
  const clearSelection = () => {
    setSelectedNodeIds(new Set());
  };

  // Function to check for clicks outside the nodes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInside = Object.values(nodeRefs.current).some(
        (node) => node && node.contains(event.target as Node)
      );

      if (!isClickInside) {
        clearSelection();
      }
    };

    // Attach a click event to the document when the component is rendered
    document.addEventListener("click", handleClickOutside);

    // Clean up event when component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.postmanGrading}?examPaperId=${examPaperId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (response.ok) {
          const data = await response.json();

          const dataWithOrder = data.map((node: any, index: number) => ({
            ...node,
            // order priority from node 2
            postmanForGradingOrder: node.postmanForGradingOrder ?? (index > 0 ? index : null),
          }));

          setPostmanData(dataWithOrder);
        } else {
          console.error("Failed to fetch data");
        }

        // Call the second API
        const infoFilePostmanResponse = await fetch(
          `${BASE_URL}${API_ENDPOINTS.infoFilePostmanExamPaper}?examPaperId=${examPaperId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,

            },
          }
        );

        if (infoFilePostmanResponse.ok) {
          const infoFilePostmanData = await infoFilePostmanResponse.json();
          setIsConfirmFile(infoFilePostmanData.isComfirmFile);
          setTotalItem(infoFilePostmanData.totalItem);
          setFileCollectionPostman(infoFilePostmanData.fileCollectionPostman);
          setLogRunPostman(infoFilePostmanData.logRunPostman);
        } else {
          console.error("Failed to fetch infoFilePostman data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token && examPaperId) {
      fetchData();
      setReloadData(false);
    }

  }, [token, reloadData, examPaperId]);

  const handleActionChange = (action: string) => {
    setSelectedAction(action);
    if (action === "updateAndConfirmFilePostman") {
      updateAndConfirmFilePostman();

    } else if (action === "impostFilePostman") {
      setShowPopup(true);
    } else if (action === "calculateScores") {
      calculateScores(examPaperId, notify);
      setTimeout(() => {
        setReloadData(true);
      }, 100);
    }
    else if (action === "exportFilePostman") {
      exportFilePostman();
    }
    else if (action === "mergeAllFilePostman") {
      mergeAllFilePostman();
    } else if (action === "fixAuthFilePostman") {
      if (examPaperId && token) {
        fixAuthFilePostman(examPaperId, token, notify);
      }
    }
  };

  const handleShowOrder = () => {
    const nodesOnScreen = Object.entries(nodeRefs.current)
      .filter(([_, el]) => el !== null)
      .map(([id, el]) => ({
        id: Number(id),
        offset: (el as HTMLElement).getBoundingClientRect().top,
      }))
      .sort((a, b) => a.offset - b.offset);

    const sortedNodes = nodesOnScreen.map(({ id }, index) => {
      const node = postmanData.find((n) => n.postmanForGradingId === id);
      return {
        ...node,
        order: index + 1,
      };
    });

    return sortedNodes;
  };


  const exportFilePostman = async () => {
    if (!examPaperId) {
      notify({
        title: "Error",
        description: "Invalid exam paper ID.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.exportPostman}/${examPaperId}`, {

        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.info) {
          notify({
            title: "Successfully",
            description: `Exported Postman Collection Sucessfully`,
            variant: "default",
          });
          const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data.info.name}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          notify({
            title: "Error",
            description: "Failed to export Postman collection.",
            variant: "destructive",
          });
        }
      } else {
        const errorMessage = await response.text();
        notify({
          title: "Error",
          description: `Failed to export: ${errorMessage}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      notify({
        title: "Error",
        description: `Something went wrong: ${error}`,
        variant: "destructive",
      });
    }
  };

  const mergeAllFilePostman = async () => {
    if (!examPaperId) {
      notify({
        title: "Error",
        description: "Exam Paper ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.mergeFilePostman}/${examPaperId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.text();

        if (result.includes("Successfully")) {
          notify({
            title: "Success",
            description: `Merge successfully`,
            variant: "default",
          });
          window.location.reload();
        } else {
          notify({
            title: "Error",
            description: "Merge failed. Unexpected response.",
            variant: "destructive",
          });
        }
      } else {
        const errorMessage = await response.text();
        notify({
          title: "Error",
          description: `Merge failed. ${errorMessage}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      notify({
        title: "Error!",
        description: `An error occurred: ${error}`,
        variant: "destructive",
      });
    }
  };

  const updateAndConfirmFilePostman = async () => {
    if (!examPaperId) {
      notify({
        title: "Error",
        description: "Exam Paper ID is missing.",
        variant: "destructive",
      });
      return;
    }
    // Call the updateListFunction function first
    const sortedNodes = handleShowOrder();
    const updateDTOs: any[] = sortedNodes.map((node) => ({
      postmanForGradingId: node.postmanForGradingId,
      postmanFunctionName: node.postmanFunctionName,
      postmanForGradingParentId: node.postmanForGradingParentId,
    }));
    try {
      const updateResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.updatePostmanGrading}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examPaperId, updateDTOs }),
      });
      if (!updateResponse.ok) {
        const errorMessage = await updateResponse.text();
        notify({
          title: "Something went wrong",
          description: "There is a problem with the tree, please reload the page",
          variant: "destructive",
        });
        throw new Error(`Update failed: ${errorMessage}, `);
      }
      const updateResult = await updateResponse.text();
      if (!updateResult.includes("Successfully")) {
        notify({
          title: "Something went wrong",
          description: "There is a problem with the tree, please reload the page",
          variant: "destructive",
        });
      }

      // Call confirmFilePostman after successful update
      const confirmResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.confirmFilePostman}/${examPaperId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!confirmResponse.ok) {
        const errorMessage = await confirmResponse.text();
        notify({
          title: "Confirm fail",
          description: "Please calculate score before confirm",
          variant: "destructive",
        });
        throw new Error(`Confirm failed: ${errorMessage}, `);
      }
      const confirmResult = await confirmResponse.text();
      if (!confirmResult.includes("Successfully")) {
        notify({
          title: "Confirm fail",
          description: "Please calculate score before confirm",
          variant: "destructive",
        });
      }
      notify({
        title: "Confirm Success",
        description: "File postman confirmed successfully.",
        variant: "default",
      });
      setReloadData(true);
    } catch (error) {
      notify({
        title: "Something went wrong",
        description: `Please Calculate Scores before Confirm.. ${error}`,
        variant: "destructive",
      });
      throw new Error(`Confirm failed: ${error}, `);
    }
  };

  const getChildrenNodes = (parentId: number, allNodes: any[]) => {
    return allNodes
      .slice(1) // Skip the first element in the list
      .filter((node) => node.postmanForGradingParentId === parentId);
  };

  // Handle the click event to select or deselect the node
  const handleNodeClick = (nodeId: number) => {
    if (nodeId === 0) {
      notify({
        title: "Error",
        description: "Cannot select the root node.",
        variant: "destructive",
      });
      return;
    }
    setSelectedNodeIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(nodeId)) {
        newSelectedIds.delete(nodeId);
      } else {
        newSelectedIds.add(nodeId);
      }
      return newSelectedIds;
    });
  };

  const moveNodesToNewParent = (selectedNodeIds: Set<number>, targetNodeId: number) => {
    const updatedNodes = [...postmanData];
    // The function moves all child nodes recursively, keeping the parent-child relationship intact
    const moveChildrenRecursive = (parentId: number, newParentId: number) => {
      updatedNodes.forEach((node) => {
        if (node.postmanForGradingParentId === parentId) {
          node.postmanForGradingParentId = newParentId; // Update parentId for child node
          moveChildrenRecursive(node.postmanForGradingId, newParentId); // Recursively move the child nodes of this node
        }
      });
    };

    // Check if the selected nodes do not have a parent-child relationship
    const hasParentChildRelationship = Array.from(selectedNodeIds).some((draggedNodeId) => {
      return Array.from(selectedNodeIds).some((otherNodeId) => {
        // Check if a node is the parent of another node
        return draggedNodeId !== otherNodeId && isAncestor(draggedNodeId, otherNodeId, postmanData);
      });
    });

    // If there is no parent-child relationship, all nodes will become children of targetNodeId
    if (!hasParentChildRelationship) {
      selectedNodeIds.forEach((nodeId) => {
        updatedNodes.forEach((node) => {
          if (node.postmanForGradingId === nodeId) {
            node.postmanForGradingParentId = targetNodeId; // Set targetNodeId as the node's parent
          }
        });
      });
    } else {
      // Move the first node to targetNodeId
      const firstSelectedNodeId = [...selectedNodeIds][0];

      // Check if the node is trying to move into itself or into its child node
      if (isAncestor(firstSelectedNodeId, targetNodeId, postmanData)) {
        notify({
          title: "Error",
          description: "Cannot move parent node into its child.",
          variant: "destructive",
        });
        return;
      }

      // Move the parent node to targetNodeId
      updatedNodes.forEach((node) => {
        if (node.postmanForGradingId === firstSelectedNodeId) {
          node.postmanForGradingParentId = targetNodeId; // Move the main node
        }
      });

      // Move child nodes but keep them as children of draggedNodeId
      moveChildrenRecursive(firstSelectedNodeId, firstSelectedNodeId);
    }

    setPostmanData(updatedNodes);
  };

  const updateNodeOrder = (parentId: number, nodeId: number, targetId: number, position: "moveBelowNode") => {
    const updatedNodes = [...postmanData];
    const parentNodeChildren = getChildrenNodes(parentId, updatedNodes).sort(
      (a, b) => a.postmanForGradingOrder - b.postmanForGradingOrder
    );
    const draggedNodeIndex = parentNodeChildren.findIndex((node) => node.postmanForGradingId === nodeId);
    const targetNodeIndex = parentNodeChildren.findIndex((node) => node.postmanForGradingId === targetId);
    if (draggedNodeIndex !== -1 && targetNodeIndex !== -1) {
      const draggedNode = parentNodeChildren.splice(draggedNodeIndex, 1)[0];
      const newPosition = position === "moveBelowNode" ? targetNodeIndex : targetNodeIndex + 1;
      parentNodeChildren.splice(newPosition, 0, draggedNode);
      // Update the order priority
      parentNodeChildren.forEach((node, index) => {
        node.postmanForGradingOrder = index; // Update order based on new position
      });
      // Update the main postmanData
      const finalNodes = updatedNodes.map((node) =>
        node.postmanForGradingParentId === parentId
          ? parentNodeChildren.find((child) => child.postmanForGradingId === node.postmanForGradingId) || node
          : node
      );
      setPostmanData(finalNodes);

    }
  };

  const handleDrop = (targetId: number, action: "moveToNode" | "moveBelowNode") => {
    if (selectedNodeIds.size === 0) return;
    if (action === "moveToNode") {
      for (let draggedNodeId of selectedNodeIds) {
        if (draggedNodeId === targetId) {
          notify({
            title: "Error",
            description: "Cannot move node into itself.",
            variant: "destructive",
          });
          return;
        }
        else if (isAncestor(draggedNodeId, targetId, postmanData)) {
          notify({
            title: "Error",
            description: "Cannot move parent node into its child.",
            variant: "destructive",
          });
          return;
        }
      }
      moveNodesToNewParent(selectedNodeIds, targetId);
    }
    if (action === "moveBelowNode") {
      if (selectedNodeIds.size > 1) {
        notify({
          title: "Error",
          description: "You can only move one node at a time using 'move below node'.",
          variant: "destructive",
        });
        return;
      }
      selectedNodeIds.forEach((draggedNodeId) => {
        const parentId = postmanData.find((node) => node.postmanForGradingId === targetId)?.postmanForGradingParentId;
        if (parentId !== undefined) {
          updateNodeOrder(parentId, draggedNodeId, targetId, action);
        }
      });
    }
    setSelectedNodeIds(new Set());
  };

  // Function to check if a node is an ancestor of another node
  const isAncestor = (ancestorId: number, descendantId: number, allNodes: any[]): boolean => {
    let currentNode = allNodes.find((node) => node.postmanForGradingId === descendantId);
    const visited = new Set<number>(); // Keep track of visited nodes to avoid infinite loops

    while (currentNode) {
      if (visited.has(currentNode.postmanForGradingId)) {
        console.error("Circular reference detected in postmanData!");
        return false; // Returns false if a loop is detected
      }
      visited.add(currentNode.postmanForGradingId);
      if (currentNode.postmanForGradingParentId === ancestorId) {
        return true;
      }
      currentNode = allNodes.find((node) => node.postmanForGradingId === currentNode.postmanForGradingParentId);
    }
    return false;
  };

  const renderTree = (parent: any, allNodes: any[]) => {
    const children = getChildrenNodes(parent.postmanForGradingId, allNodes).sort(
      (a, b) => a.postmanForGradingOrder - b.postmanForGradingOrder
    );
    const isSelected = selectedNodeIds.has(parent.postmanForGradingId);
    return (
      <div
        ref={(el) => {
          if (el) nodeRefs.current[parent.postmanForGradingId] = el;// Assign ref to each node
        }}
      >
        <ul className="ml-10">
          <li key={parent.postmanForGradingId} className="mt-2">
            {/* Main Node */}
            <div
              draggable
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(parent.postmanForGradingId, "moveToNode");
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`p-3 rounded-lg cursor-pointer border ${isSelected ? "border-orange-500" : "border-gray-300"}`}
              onClick={() => handleNodeClick(parent.postmanForGradingId)}
            >

              <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
                <span className="font-semibold">{parent.postmanFunctionName}</span>
                <span className="text-sm text-gray-600">{parent.endPoint}</span>
                <span className="text-sm text-gray-600">
                  Score: {parseFloat((parent.scoreOfFunction ?? 0).toFixed(2))}
                </span>
                <span className="text-sm text-gray-600">
                  Percentage: {parseFloat((parent.scorePercentage ?? 0).toFixed(1))} %
                </span>
                <span className="text-sm text-gray-600">Pmtest: {parent.totalPmTest ?? "0"}</span>
              </div>
            </div>
            {/* Lower Div of node */}
            <div
              className="bg-gray-50 h-4 mt-2 rounded-md"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(parent.postmanForGradingId, "moveBelowNode")}
            ></div>
            {/* Recursively render child nodes */}
            {children.map((child) => renderTree(child, allNodes))}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <SidebarInset>
      {Header}
      <div className="w-full border border-gray-200 rounded-lg" style={{ marginLeft: "1rem", marginRight: "1rem", marginBottom: "1rem", maxWidth: "calc(100% - 2rem)" }}>
        <PostmanForGradingLayout
          top={
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Postman For Grading</h1>
              <p className="text-sm text-muted-foreground">Function tree is showing!</p>
            </div>
          }
          leftTop={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2 className="h-4 w-4" />
                  List action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>List action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleActionChange("impostFilePostman")}>
                  Import File Postman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("exportFilePostman")}>
                  Export File Postman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("mergeAllFilePostman")}>
                  Merge All File Postman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("fixAuthFilePostman")}>
                  Fix Auth All File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("calculateScores")}>
                  Calculate Scores
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("updateAndConfirmFilePostman")}>
                  Update and Confirm Postman Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
          leftBottom={
            <div
              className="p-4 space-y-4"
              onClick={clearSelection}// When clicking leftBottom, deselect all nodes
            >
              <h1 className="text-xl font-semibold text-gray-800">Info main file postman</h1>
              {isConfirmFile !== null && totalItem !== null ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Is Confirmed File: </strong>
                    {isConfirmFile ? "Yes" : "Not yet"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Total Function: </strong> {totalItem}
                  </p>
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => setShowFilePostmanDialog(true)}
                  >
                    Show File Collection Data
                  </Button>
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => setShowLogRunPostmanDialog(true)}
                  >
                    Show log File Collection Data
                  </Button>
                </div>
              ) : (
                <Skeleton />
              )}
            </div>
          }
          right={
            <div className="p-4">
              {postmanData.length > 0 && renderTree(postmanData[0], postmanData)}
            </div>
          }
        />
      </div>
      {showPopup && (
        <ImpostFilePostmanPopup
          onClose={() => {
            setShowPopup(false);
            setReloadData(true);
          }}
          examPaperId={examPaperId}
        />
      )}
      {showFilePostmanDialog && (
        <FileCollectionDialog
          fileCollectionPostman={fileCollectionPostman}
          open={showFilePostmanDialog}
          onClose={() => setShowFilePostmanDialog(false)}
        />
      )}
      {showLogRunPostmanDialog && (
        <LogRunPostmanDialog
          logRunPostman={logRunPostman}
          open={showLogRunPostmanDialog}
          onClose={() => setShowLogRunPostmanDialog(false)}
        />
      )}
    </SidebarInset>
  );
};
export default Page;