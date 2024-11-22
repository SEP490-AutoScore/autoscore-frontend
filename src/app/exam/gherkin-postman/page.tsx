import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import GherkinPostmanLayout from "./gherkin-postman-layout";

const GherkinPostmanPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");

  const location = useLocation();
  const { examId, examPaperId } = location.state || {};


  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: "Exam Details",
    breadcrumbLink_2: "/exams/exam-papers",
    breadcrumbPage_3: "Gherkin Postman",
    stateGive: { examId: examId },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("JWT Token không tồn tại. Vui lòng đăng nhập.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairs}${examPaperId}`, // Chèn trực tiếp examPaperId
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }

    };

    fetchData();
  }, [token, examPaperId]);

  if (!examPaperId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Missing required information. Please go back.</AlertDescription>
      </Alert>
    );

  }

  const gherkinContent = loading ? (
    <Skeleton className="h-64 w-full" /> // Skeleton khi loading
  ) : (
    <div>
      {data.map((item: any, index) => (
        <Card key={index} className="mb-4 resize-y overflow-auto">
          <CardHeader>
            <CardTitle>Scenario #{item.gherkin?.gherkinScenarioId}</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <pre className="text-sm whitespace-pre-wrap">
              {item.gherkin?.gherkinData}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );


  // Postman Content
  const postmanContent = loading ? (
    <Skeleton className="h-64 w-full" /> // Skeleton khi loading
  ) : (
    <div>
      {data.map((item: any, index) => (
        <Card key={index} className="mb-4 resize-y overflow-auto">
          <CardHeader>
            <CardTitle>Postman Function: {item.postman?.postmanFunctionName}</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {item.postman ? (
              <>
                <p className="text-sm">Total PM Tests: {item.postman?.totalPmTest}</p>
                <pre className="text-sm whitespace-pre-wrap bg-gray-200 p-2 rounded">
                  {atob(item.postman?.fileCollectionPostman)}
                </pre>
                <p className="text-sm">
                  Status: {item.postman?.status ? "Active" : "Inactive"}
                </p>
              </>
            ) : (
              <p className="italic text-gray-500">No Postman data available.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );


  return (
    <SidebarInset>
      {Header}
      <GherkinPostmanLayout

        top={{
          left: "Gherkin Tool",
          right: "Postman Tool",
        }}
        left={gherkinContent}
        right={postmanContent}
      />
    </SidebarInset>
  );
};

export default GherkinPostmanPage;
