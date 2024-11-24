import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import GherkinPostmanLayout from "./gherkin-postman-layout";
import { useToastNotification } from "@/hooks/use-toast-notification";

const GherkinPostmanPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [selectedGherkins, setSelectedGherkins] = useState<number[]>([]);
  const gherkinContainerRef = useRef<HTMLDivElement>(null);
  const gherkinActionRef = useRef<HTMLSelectElement>(null); 
  const postmanActionRef = useRef<HTMLSelectElement>(null);

  const notify = useToastNotification();

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

  // Toggle chọn hoặc bỏ chọn một khung Gherkin
  const toggleGherkinSelection = (gherkinScenarioId: number) => {
    setSelectedGherkins((prevSelected) =>
      prevSelected.includes(gherkinScenarioId)
        ? prevSelected.filter((id) => id !== gherkinScenarioId)
        : [...prevSelected, gherkinScenarioId]
    );
  };


   // Xử lý khi đổi câu hỏi
   const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const questionId = e.target.value ? Number(e.target.value) : null;
    setSelectedQuestionId(questionId);
    clearSelectedGherkins(); // Xóa các Gherkin đã chọn khi chuyển câu hỏi
  };

  const clearSelectedGherkins = () => {
    setSelectedGherkins([]);
  };

    // Xử lý click bên ngoài để bỏ chọn Gherkins
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
  
        if (
          !gherkinContainerRef.current?.contains(target) &&
          !gherkinActionRef.current?.contains(target) &&
          !postmanActionRef.current?.contains(target)
        ) {
          clearSelectedGherkins();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);



  const questionDropdown = (
    <select
      className="w-1/2 p-2 border border-gray-300 rounded-lg"
      onChange={handleQuestionChange}
      value={selectedQuestionId || ""}
    >
      <option value="">Choose Question</option>
      {questions.map((questionId) => (
        <option key={questionId} value={questionId}>
          Question ID {questionId}
        </option>
      ))}
    </select>
  );



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





  
  // Fetch Data for Selected Question
  useEffect(() => {
    const fetchGherkinPostmanPairs = async () => {
      if (!token || !selectedQuestionId) return;

      try {
        setLoading(true);

        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairsByQuestion}?questionId=${selectedQuestionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi gọi API lấy cặp Gherkin và Postman");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGherkinPostmanPairs();
  }, [token, selectedQuestionId]);




 

  // Handle Generate Gherkin
  const handleGenerateGherkin = async () => {
    if (!token || !selectedQuestionId) {
      notify({
        title: "Validation Error",
        description: "Vui lòng chọn một câu hỏi trước khi tạo Gherkin.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.generateGherkin}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examQuestionIds: [selectedQuestionId] }),
        }
      );

      if (!response.ok) {
        throw new Error("Error!");
      }

      notify({
        title: "Success",
        description: "Generate Gherkin Format Successfully!",
        variant: "default",
      });

      const result = await response.json();
    
    } catch (error) {
      notify({
        title: "API Error",
        description: "Đã xảy ra lỗi khi tạo Gherkin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  //Generate postman script
  const generatePostmanScript = async () => {
    if (!selectedGherkins.length) {
      notify({
        title: "No Selection",
        description: "Please select at least one Gherkin Scenario.",
        variant: "default",
      });
      return;
    }

    if (!token) {
      notify({
        title: "Authentication Error",
        description: "JWT Token không tồn tại. Vui lòng đăng nhập.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const gherkinScenarioId of selectedGherkins) {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.generatePostman}/${gherkinScenarioId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.text();
          notify({
            title: "Success",
            description: result,
            variant: "default",
          });
        } else {
          const errorMessage = await response.text();
          notify({
            title: "API Error",
            description: `Failed to create Postman script for Gherkin ID: ${gherkinScenarioId}. ${errorMessage}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      notify({
        title: "Error",
        description: `An unexpected error occurred: ${error}`,
        variant: "destructive",
      });
    }
  };


  //Gherkin Content
  const gherkinContent = loading ? (
    <Skeleton className="h-64 w-full" />
  ) : (
    // <div>
    <div ref={gherkinContainerRef}>
      {data.map((item: any, index) => {
        const isSelected = selectedGherkins.includes(
          item.gherkin?.gherkinScenarioId
        );

        return (
          <Card
            key={index}
            className={`mb-4 resize-y overflow-auto cursor-pointer ${isSelected ? "border-2 border-orange-500" : "border"
              }`}
            onClick={() =>
              toggleGherkinSelection(item.gherkin?.gherkinScenarioId)
            }
          >
            <CardHeader>
              <CardTitle>
                Scenario #{item.gherkin?.gherkinScenarioId}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <pre className="text-sm whitespace-pre-wrap">
                {item.gherkin?.gherkinData}
              </pre>
            </CardContent>
          </Card>
        );
      })}
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
                  <select
                    ref={gherkinActionRef} 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    onChange={(e) => {
                      if (e.target.value === "Generate Gherkin") {
                        handleGenerateGherkin();
                      }
                    }}
                  >
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
                  <select
                    ref={postmanActionRef} 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    onChange={(e) => {
                      if (e.target.value === "Create script postman") {
                        generatePostmanScript();
                      }
                    }}
                  >
                    <option value="">Postman Action</option>
                    <option value="Create script postman">
                      Generate script postman
                    </option>
                    <option value="Delete">Delete</option>
                    <option value="Create">Create</option>
                    <option value="Create more">Create more</option>
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
