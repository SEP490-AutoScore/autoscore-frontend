import React, { useEffect, useState } from "react";
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


const Page: React.FC = () => {
  const [postmanData, setPostmanData] = useState<any[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null); 
  const token = localStorage.getItem("jwtToken");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false); 
  const notify = useToastNotification(); 

  const location = useLocation();
  const { examId, examPaperId } = location.state || {};

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
        const response = await fetch("http://localhost:8080/api/postman-grading?examPaperId=1", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const dataWithOrder = data.map((node: any, index: number) => ({
            ...node,
            // Gắn thứ tự từ phần tử thứ 2 trở đi
            postmanForGradingOrder: node.postmanForGradingOrder ?? (index > 0 ? index : null),
          }));


          setPostmanData(dataWithOrder);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  
  
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


  const updateNodeOrder = (parentId: number, nodeId: number, targetId: number, position: "above" | "below") => {
    const updatedNodes = [...postmanData];
    const parentNodeChildren = getChildrenNodes(parentId, updatedNodes).sort(
      (a, b) => a.postmanForGradingOrder - b.postmanForGradingOrder
    );

    const draggedNodeIndex = parentNodeChildren.findIndex((node) => node.postmanForGradingId === nodeId);
    const targetNodeIndex = parentNodeChildren.findIndex((node) => node.postmanForGradingId === targetId);

    if (draggedNodeIndex !== -1 && targetNodeIndex !== -1) {
      const draggedNode = parentNodeChildren.splice(draggedNodeIndex, 1)[0];
      const newPosition = position === "above" ? targetNodeIndex : targetNodeIndex + 1;
      parentNodeChildren.splice(newPosition, 0, draggedNode);

      // Cập nhật lại thứ tự
      parentNodeChildren.forEach((node, index) => {
        node.postmanForGradingOrder = index; // Cập nhật thứ tự dựa trên vị trí mới
      });

      // Ghi lại vào danh sách gốc
      const finalNodes = updatedNodes.map((node) =>
        node.postmanForGradingParentId === parentId
          ? parentNodeChildren.find((child) => child.postmanForGradingId === node.postmanForGradingId) || node
          : node
      );

      setPostmanData(finalNodes);
    }
  };

  const handleDrop = (targetId: number, action: "parent" | "above" | "below") => {
    if (draggedNodeId === null) return;

    if (action === "parent") {
      moveNodeToNewParent(draggedNodeId, targetId);
    } else {
      const parentId = postmanData.find((node) => node.postmanForGradingId === targetId)?.postmanForGradingParentId;
      if (parentId !== undefined) {
        updateNodeOrder(parentId, draggedNodeId, targetId, action);
      }
    }

    setDraggedNodeId(null); // Reset trạng thái kéo
  };

  const handleActionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    setSelectedAction(action);

    if (action === "updateData") {
      await updateDataToServer();
    }else if (action === "impostPostman") {
      setShowPopup(true); 
    }
   
  };

 const updateDataToServer = async () => {
  const updateDTOs = postmanData.map((node) => ({
    postmanForGradingId: node.postmanForGradingId,
    postmanFunctionName: node.postmanFunctionName,
    scoreOfFunction: node.scoreOfFunction,
    postmanForGradingParentId: node.postmanForGradingParentId,
  }));

  // Ghi log toàn bộ thông tin node trước khi update
  console.log("Dữ liệu trước khi update:", updateDTOs);

  try {
    const response = await fetch("http://localhost:8080/api/postman-grading", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        examPaperId: 1,
        updateDTOs,
      }),
    });

    if (response.ok) {
      const result = await response.text(); // Đọc phản hồi dạng text
      console.log("Phản hồi từ server:", result);

    
      if (result.includes("Successfully")) {
        notify({
          title: "Thành công!",
          description: "Cập nhật Postman_For_Grading thành công.",
          variant: "default",
        });
      } else {
        notify({
          title: "Cảnh báo",
          description: "Phản hồi không chứa 'Successfully', kiểm tra lại.",
          variant: "default",
        });
        console.error("Unexpected response:", result);
      }
    } else {
      const errorMessage = await response.text();
      notify({
        title: "Thất bại!",
        description: `Cập nhật thất bại: ${errorMessage}`,
        variant: "destructive",
      });
      console.error("Error:", errorMessage);
    }
  } catch (error) {
    notify({
      title: "Lỗi!",
      description: `Có lỗi xảy ra khi cập nhật: ${error}`,
      variant: "destructive",
    });
    console.error("Error:", error);
  }
};


  const renderTree = (parent: any, allNodes: any[]) => {

    const children = getChildrenNodes(parent.postmanForGradingId, allNodes).sort(
      (a, b) => a.postmanForGradingOrder - b.postmanForGradingOrder
    );

    const handleDragStart = (e: React.DragEvent) => {
      setDraggedNodeId(parent.postmanForGradingId);
    };

    // Hàm cập nhật điểm số khi người dùng chỉnh sửa
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value); // Chuyển giá trị từ input thành float
      const newScore = isNaN(value) ? 0 : value; // Đảm bảo giá trị hợp lệ (nếu không nhập gì thì mặc định là 0)

      // Cập nhật node trong danh sách
      const updatedNodes = postmanData.map((node) =>
        node.postmanForGradingId === parent.postmanForGradingId
          ? { ...node, scoreOfFunction: newScore }
          : node
      );

      setPostmanData(updatedNodes);
    };

    return (
      <ul className="ml-4 list-disc">
        <li key={parent.postmanForGradingId} className="mt-2">
          {/* Node chính */}
          <div
            draggable
            onDragStart={handleDragStart}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(parent.postmanForGradingId, "parent");
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
                  step="0.01" // Cho phép nhập số thập phân
                  value={parent.scoreOfFunction ?? 0}
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
            onDrop={() => handleDrop(parent.postmanForGradingId, "above")}
          ></div>

          {/* Đệ quy render các node con */}
          {children.map((child) => renderTree(child, allNodes))}

          {/* Div dưới */}
          <div
            className="bg-gray-200 h-4 mt-2 rounded-md"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(parent.postmanForGradingId, "below")}
          ></div>
        </li>
      </ul>
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
          <p className="text-sm text-muted-foreground">Here's tree!!</p>
         
        </div>
            
      }
      left={
        <div className="space-y-4">
     
          <select
            className="border border-gray-300 rounded-md p-2"
            value={selectedAction}
            onChange={handleActionChange}
          >
            <option value="">Select an action</option>
            <option value="updateData">Update list functions</option>
            <option value="impostPostman">Import postman</option>
            {/* Thêm các tùy chọn khác ở đây */}
          </select>
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
          onClose={() => setShowPopup(false)}
          examPaperId={examPaperId} // Đảm bảo examPaperId luôn là số
        />
      )}
     </SidebarInset>
  );
};

export default Page;