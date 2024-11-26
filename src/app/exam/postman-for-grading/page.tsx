import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import { useToastNotification } from "@/hooks/use-toast-notification";
import PostmanForGradingLayout from "./postman-for-grading-layout";
import ImpostFilePostmanPopup from "./import-file-postman";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Settings2 } from "lucide-react";
import FileCollectionPopup from "./FileCollectionPopup";
import LogRunPostman from "./LogRunPostmanPopup";

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
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const token = localStorage.getItem("jwtToken");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const notify = useToastNotification();
  const [reloadData, setReloadData] = useState<boolean>(false);
  const nodeRefs = useRef<Record<number, HTMLElement | null>>({});
  const [isConfirmFile, setIsConfirmFile] = useState<boolean | null>(null);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [fileCollectionPostman, setFileCollectionPostman] = useState<string | null>(null);
  const [logRunPostman, setLogRunPostman] = useState<string | null>(null);
  const [showFilePostmanPopup, setShowFilePostmanPopup] = useState<boolean>(false);
  const [showLogRunPostmanPopup, setShowLogRunPostmanPopup] = useState<boolean>(false);



  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: "Exam Details",
    breadcrumbLink_2: "/exams/exam-papers",
    breadcrumbPage_3: "Postman For Grading",
    stateGive: { examId: examId },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Gọi API đầu tiên

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

        // Gọi API thứ hai
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
    if (action === "updateListFunction") {
      updateListFunction();
    } else if (action === "impostFilePostman") {
      setShowPopup(true);

    }
    else if (action === "exportFilePostman") {
      exportFilePostman();
    }
    else if (action === "mergeAllFilePostman") {
      mergeAllFilePostman();
    }
    else if (action === "confirmFilePostman") {
      confirmFilePostman();
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
        order: index + 1, // Gắn thêm thứ tự mới
      };
    });

    return sortedNodes; // Trả về danh sách node đã sắp xếp
  };


  const updateListFunction = async () => {
    if (!examPaperId) {
      notify({
        title: "Error",
        description: "Exam Paper ID is missing.",
        variant: "destructive",
      });
      return;
    }

    const sortedNodes = handleShowOrder();
    const updateDTOs: any[] = [];
    for (const sortedNode of sortedNodes) {
      updateDTOs.push({
        postmanForGradingId: sortedNode.postmanForGradingId,
        postmanFunctionName: sortedNode.postmanFunctionName,
        scoreOfFunction: sortedNode.scoreOfFunction,
        postmanForGradingParentId: sortedNode.postmanForGradingParentId,

      });
    }


    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.updatePostmanGrading}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examPaperId,
          updateDTOs,
        }),
      });
      console.log(updateDTOs)
      if (response.ok) {
        const result = await response.text();


        if (result.includes("Successfully")) {
          notify({
            title: "Successfully",
            description: "Update successfully.",
            variant: "default",
          });
          setReloadData(true);
        } else {
          notify({
            title: "Error",
            description: "Something went wrong. Please reload page",
            variant: "default",
          });
        }
      } else {
        const errorMessage = await response.text();
        notify({
          title: "Error",
          description: `Something went wrong. ${errorMessage}`,
          variant: "destructive",
        });

      }
    } catch (error) {
      notify({
        title: "Error!",
        description: `Something went wrong. ${error}`,
        variant: "destructive",
      });

    }
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
          // Nếu có thông tin trả về, thông báo thành công
          notify({
            title: "Successfully",
            description: `Exported Postman Collection Sucessfully`,
            variant: "default",
          });

          // Tạo file từ response và lưu vào máy người dùng
          const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data.info.name}.json`; // Đặt tên file cho collection
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url); // Hủy URL sau khi tải xuống
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
          setReloadData(true);
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



  const confirmFilePostman = async () => {
    if (!examPaperId) {
      notify({
        title: "Error",
        description: "Exam Paper ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.confirmFilePostman}/${examPaperId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.text();

        if (result.includes("Successfully")) {
          notify({
            title: "Success",
            description: `Confirm file successfully`,
            variant: "default",
          });
          setReloadData(true);
        } else {
          notify({
            title: "Error",
            description: "Confirm failed. Unexpected response.",
            variant: "destructive",
          });
        }
      } else {
        const errorMessage = await response.text();
        notify({
          title: "Error",
          description: `Confirm failed. ${errorMessage}`,
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


  const getChildrenNodes = (parentId: number, allNodes: any[]) => {
    return allNodes
      .slice(1) // Bỏ qua phần tử đầu tiên trong danh sách
      .filter((node) => node.postmanForGradingParentId === parentId);
  };


  const moveNodeToNewParent = (draggedNodeId: number, targetNodeId: number) => {
    const updatedNodes = [...postmanData];

    // Cập nhật cha của node bị kéo
    updatedNodes.forEach((node) => {
      if (node.postmanForGradingId === draggedNodeId) {
        node.postmanForGradingParentId = targetNodeId;
      }
    });

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
    if (draggedNodeId === null) return;


    if (action === "moveToNode") {
      if (draggedNodeId === targetId) {

        notify({
          title: "Error",
          description: "Cannot move node into itself.",
          variant: "destructive",
        });

        setDraggedNodeId(null);
        return;
      }

      // Kiểm tra nếu node cha đang cố di chuyển vào node con
      else if (isAncestor(draggedNodeId, targetId, postmanData)) {
        notify({
          title: "Error",
          description: "Cannot move parent node into its child.",
          variant: "destructive",
        });
        setDraggedNodeId(null);
        return;
      }
      moveNodeToNewParent(draggedNodeId, targetId);
    } else {
      const parentId = postmanData.find((node) => node.postmanForGradingId === targetId)?.postmanForGradingParentId;
      if (parentId !== undefined) {
        updateNodeOrder(parentId, draggedNodeId, targetId, action);
      }
    }

    setDraggedNodeId(null); // Reset trạng thái kéo
  };


  // Hàm kiểm tra xem một node có phải tổ tiên của một node khác hay không
  const isAncestor = (ancestorId: number, descendantId: number, allNodes: any[]): boolean => {
    let currentNode = allNodes.find((node) => node.postmanForGradingId === descendantId);
    const visited = new Set<number>(); // Theo dõi các node đã duyệt để tránh vòng lặp vô hạn

    while (currentNode) {
      if (visited.has(currentNode.postmanForGradingId)) {
        console.error("Circular reference detected in postmanData!");
        return false; // Trả về false nếu phát hiện vòng lặp
      }
      visited.add(currentNode.postmanForGradingId);

      if (currentNode.postmanForGradingParentId === ancestorId) {
        return true; // Nếu tìm thấy ancestor
      }
      currentNode = allNodes.find((node) => node.postmanForGradingId === currentNode.postmanForGradingParentId);
    }
    return false; // Không tìm thấy ancestor
  };








  const renderTree = (parent: any, allNodes: any[]) => {
    const children = getChildrenNodes(parent.postmanForGradingId, allNodes).sort(
      (a, b) => a.postmanForGradingOrder - b.postmanForGradingOrder
    );

    const handleDragStart = (e: React.DragEvent) => {
      setDraggedNodeId(parent.postmanForGradingId);
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();

      // Nếu giá trị rỗng, cập nhật điểm số thành null hoặc giá trị mặc định
      if (value === "") {
        const updatedNodes = postmanData.map((node) =>
          node.postmanForGradingId === parent.postmanForGradingId
            ? { ...node, scoreOfFunction: null } // Hoặc giá trị mặc định
            : node
        );
        setPostmanData(updatedNodes);
        return;
      }

      // Kiểm tra giá trị hợp lệ
      if (isNaN(parseFloat(value))) {
        return;
      }

      const newScore = parseFloat(value);

      // Cập nhật node trong danh sách
      const updatedNodes = postmanData.map((node) =>
        node.postmanForGradingId === parent.postmanForGradingId
          ? { ...node, scoreOfFunction: newScore }
          : node
      );

      setPostmanData(updatedNodes);
    };

    return (
      <div

        ref={(el) => {
          if (el) nodeRefs.current[parent.postmanForGradingId] = el; // Gán ref cho từng node
        }}
      >
        <ul className="ml-10 list-disc">
          <li key={parent.postmanForGradingId} className="mt-2">
            {/* Node chính */}
            <div
              draggable
              onDragStart={handleDragStart}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(parent.postmanForGradingId, "moveToNode");
              }}
              onDragOver={(e) => e.preventDefault()}
              className="p-3 rounded-lg cursor-pointer border border-gray-300"
            >
              {/* Hiển thị thông tin node */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{parent.postmanFunctionName}</span>
                <span className="text-sm text-gray-600">
                  ({parent.totalPmTest ?? "0"} test cases)
                </span>
                <span className="text-sm text-gray-600">
                  (ID: {parent.postmanForGradingId})
                </span>
                <span className="text-sm text-gray-600">
                  (Parent ID: {parent.postmanForGradingParentId ?? "Root"})
                </span>

              </div>

              {/* Hiển thị và chỉnh sửa điểm số */}
              <div className="mt-2">
                <label className="text-sm text-gray-600">
                  Score:
                  <input
                    type="number"

                    value={parent.scoreOfFunction}
                    onChange={handleScoreChange}
                    className="ml-2 border border-gray-300 rounded-md p-1 w-20"
                  />
                </label>
              </div>
            </div>

            {/* Div trên */}
            <div
              className="bg-gray-200 h-4 mt-2 rounded-md"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(parent.postmanForGradingId, "moveBelowNode")}
            ></div>



            {/* Đệ quy render các node con */}
            {children.map((child) => renderTree(child, allNodes))}

          </li>
        </ul>

      </div>
    );
  };

  return (
    <SidebarInset>
      {Header}
      <div className="w-full border border-gray-200  rounded-lg">
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
                <DropdownMenuItem onClick={() => handleActionChange("impostFilePostman")}>
                  Import file postman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("mergeAllFilePostman")}>
                  Merge all file postman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("updateListFunction")}>
                  Update list functions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("confirmFilePostman")}>
                  Confirm file postman
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionChange("exportFilePostman")}>
                  Export file postman
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>

          }

          leftBottom={
            <div className="p-4 space-y-4">
              {/* Heading with smaller font size */}
              <h1 className="text-xl font-semibold text-gray-800">Info main file postman </h1>

              {/* Display isConfirmFile and totalItem when button is clicked */}
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
                    onClick={() => setShowFilePostmanPopup(true)}
                  >
                    Show File Collection Data
                  </Button>
                  <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => setShowLogRunPostmanPopup(true)}
                  >
                    Show log File Collection Data
                  </Button>

                </div>
              ) : (
                <Skeleton className="w-full h-32 bg-gray-200 rounded-lg" />
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
      {showFilePostmanPopup && (
        <FileCollectionPopup
          fileCollectionPostman={fileCollectionPostman}
          onClose={() => setShowFilePostmanPopup(false)}
        />
      )}
      {showLogRunPostmanPopup && (
        <LogRunPostman
          logRunPostman={logRunPostman}
          onClose={() => setShowLogRunPostmanPopup(false)}
        />
      )}
    </SidebarInset>
  );
};

export default Page;