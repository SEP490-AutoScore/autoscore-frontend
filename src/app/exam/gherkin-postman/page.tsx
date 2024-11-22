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
  const [questions, setQuestions] = useState<any[]>([]);
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

        const [dataResponse, questionsResponse] = await Promise.all([
          fetch(`${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairs}${examPaperId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${BASE_URL}${API_ENDPOINTS.getlistIdQuestion}${examPaperId}/questions`, {
         
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!dataResponse.ok || !questionsResponse.ok) {
          throw new Error("Lỗi khi gọi API");
        }

        const Data = await dataResponse.json();
        const questionsData = await questionsResponse.json();

        setData(Data);
        setQuestions(questionsData);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
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

  const questionDropdown = (
    <select className="w-1/2 p-2 border border-gray-300 rounded-lg">
      <option>Choose Question</option>
      {questions.map((questionId) => (
        <option key={questionId} value={questionId}>
          Question ID {questionId}
        </option>
      ))}
    </select>
  );

  return (

    <SidebarInset>
      {Header}
      <div className="w-full border border-gray-200  rounded-lg">

        <GherkinPostmanLayout

          top={{
            left: (
              <>
                <div className="text-2xl font-bold tracking-tight">Gherkins</div>
                <p className="text-muted-foreground">
                  Here's a list of gherkin scenario of this question!
                </p>
                <div className="mt-2">
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Gherkin Action</option>
                    <option>Generate Gherkin</option>
                    <option>Create</option>
                    <option>Create more</option>
                  </select>
                </div>
              </>
            ),
            right: (
              <>
                <div className="text-2xl font-bold tracking-tight">Postmans</div>
                <p className="text-muted-foreground">
                  Here's a list of postman script of this question!
                </p>
                <div className="mt-2">
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Postman Action</option>
                    <option>Delete</option>
                    <option>Create</option>
                    <option>Create more</option>
                  </select>
                </div>
              </>
            ),
          }}
        
          middle={
            <>
            
            <div className="flex justify-center p-4 mb-4">{questionDropdown}</div>
              <div className="flex justify-center mb-4">
                <div className="w-1/2 p-4 bg-white border border-gray-300 rounded-lg">
                  <h2 className="text-lg font-semibold">Question Details</h2>
                  <p>Choose a question to view its details.</p>
                </div>
              </div>
            </>
          }
          left={gherkinContent}
       
          right={postmanContent}
        />
      </div>
    </SidebarInset>

  );

};

export default GherkinPostmanPage;
