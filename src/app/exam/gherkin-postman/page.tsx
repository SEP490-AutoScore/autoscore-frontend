import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import GherkinPostmanLayout from "./gherkin-postman-layout";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

// Import DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";


const GherkinPostmanPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [selectedGherkins, setSelectedGherkins] = useState<number[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [storedQuestionId, setStoredQuestionId] = useState<number | null>(null);

  const notify = useToastNotification();

  const token = localStorage.getItem("jwtToken");
  const location = useLocation();
  const { examId, examPaperId } = location.state || {};

  useEffect(() => {
    if (selectedQuestionId) {
      setStoredQuestionId(selectedQuestionId);
    }
  }, [selectedQuestionId]);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
     
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
  
  // const fetchGherkinPostmanPairs = async () => {
  //   if (!token || !selectedQuestionId) return;

  //   try {
  //     setLoading(true);

  //     const response = await fetch(
  //       `${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairsByQuestion}?questionId=${selectedQuestionId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Lỗi khi gọi API lấy cặp Gherkin và Postman");
  //     }

  //     const result = await response.json();
  //     setData(result);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch Gherkin and Postman pairs when selectedQuestionId or token changes
  // useEffect(() => {
  //   fetchGherkinPostmanPairs();
  // }, [token, selectedQuestionId]);

  const fetchGherkinPostmanPairs = async (questionId: number) => {
    if (!token || questionId === null) return; // Ensure questionId is passed as an argument
  
    try {
      setLoading(true);
  
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairsByQuestion}?questionId=${questionId}`,
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const handleActionChange = (action: string) => {
    setSelectedAction(action);
       if (action === "handleGenerateGherkin") {
        handleGenerateGherkin();
      } else if (action === "generatePostmanScriptMore") {
        handleGenerateGherkinMore();
        
    }
    else if (action === "deleteGherkin") {
      deleteGherkin();
    }
    else if (action === "generatePostmanScript") {
      generatePostmanScript();
    }
    else if (action === "generatePostmanScriptMore") {
      generatePostmanScriptMore();
    }
  };


  const handleQuestionClick = (questionId: number) => {
    setStoredQuestionId(questionId); // Set the selected question ID
    fetchGherkinPostmanPairs(questionId); // Fetch Gherkin-Postman pairs for the selected question immediately
  };

 // Render buttons for each question
 const questionButtons = (
  <div className="flex flex-wrap gap-2">
    {questions.map((questionId) => (
      <Button
        key={questionId}
        variant={storedQuestionId === questionId ? "default" : "outline"} // Highlight the selected button
        onClick={() => handleQuestionClick(questionId)}  // Handle button click
        className="w-1/4"
      >
        Question ID {questionId}
      </Button>
    ))}
  </div>
);
// const questionButtons = (
//   <div className="flex flex-wrap gap-2">
//     {questions.map((questionId) => (
//       <Button
//         key={questionId}
//         variant={selectedQuestionId === questionId ? "default" : "outline"} 
//         onClick={() => handleQuestionClick(questionId)}
//         className="w-1/4"
//       >
//         Question ID {questionId}
//       </Button>
//     ))}
//   </div>
// );

  const handleGenerateGherkin = async () => {
    if (!token || !storedQuestionId) {
      notify({
        title: "Validation Error",
        description: "Please choose 1 question before generate Gherkin.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.generateGherkin}?examQuestionId=${storedQuestionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
       
        }
      );

      if (!response.ok) {
        notify({
          title: "Error",
          description: "Failed to generate Gherkin format. May be cause by has not database",
          variant: "destructive",
        });
      }

      const result = await response.text();
    
      if (result === "Generate gherkin successfully!") {
        notify({
          title: "Success",
          description: "Generate Gherkin Format Successfully!",
          variant: "default",
        });
        if (storedQuestionId !== null) {
          await fetchGherkinPostmanPairs(storedQuestionId);
        }

      } else {
        notify({
          title: "Error",
          description: "Failed to generate Gherkin format. May be cause by has not database",
          variant: "destructive",
        });
      }
  
    } catch (error) {
      notify({
        title: "API Error",
        description: "Failed to generate Gherkin format. May be cause by has not database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      
    }
  };

  const handleGenerateGherkinMore = async () => {
    if (!token || !storedQuestionId) {
      notify({
        title: "Validation Error",
        description: "Please choose 1 question before generate Gherkin.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.generateGherkinMore}?examQuestionId=${storedQuestionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
       
        }
      );

      if (!response.ok) {
        notify({
          title: "Error",
          description: "Failed to generate Gherkin format. May be cause by has not database",
          variant: "destructive",
        });
      }

      const result = await response.text();
    
      if (result === "Generate gherkin successfully!") {
        notify({
          title: "Success",
          description: "Generate Gherkin Format Successfully!",
          variant: "default",
        });
        if (storedQuestionId !== null) {
          await fetchGherkinPostmanPairs(storedQuestionId);
        }

      } else {
        notify({
          title: "Error",
          description: "Failed to generate Gherkin format. May be cause by has not database",
          variant: "destructive",
        });
      }
  
    } catch (error) {
      notify({
        title: "API Error",
        description: "Failed to generate Gherkin format. May be cause by has not database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      
    }
  };

  const deleteGherkin = async () => {
    if (!selectedGherkins.length) {
      notify({
        title: "Validation Error",
        description: "Please select at least one Gherkin Scenario to delete.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setLoading(true);
  
      // Duyệt qua từng Gherkin Scenario ID để xóa
      for (const gherkinId of selectedGherkins) {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.deleteGherkin}/${gherkinId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          const errorText = await response.text();
          notify({
            title: "Error",
            description: `Failed to delete Gherkin Scenario ID ${gherkinId}: ${errorText}`,
            variant: "destructive",
          });
          continue;
        }
  
        const result = await response.json();
  
        if (result.gherkinScenarioId) {
          notify({
            title: "Success",
            description: `Deleted Gherkin Scenario ID ${gherkinId} successfully.`,
            variant: "default",
          });
        } else {
          notify({
            title: "Error",
            description: `Failed to delete Gherkin Scenario ID ${gherkinId}: Invalid response.`,
            variant: "destructive",
          });
        }
      }
  
      // Làm mới dữ liệu sau khi xóa
      if (storedQuestionId !== null) {
        await fetchGherkinPostmanPairs(storedQuestionId);
      }
    } catch (error) {
      notify({
        title: "API Error",
        description: "Failed to delete selected Gherkin Scenarios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
 

  const generatePostmanScript = async () => {
    if (!selectedGherkins.length) {
      notify({
        title: "No Selection",
        description: "Please select at least one Gherkin Scenario.",
        variant: "default",
      });
      return;
    }
  
    setLoading(true); // Set loading to true before starting the loop
  
    try {
      for (const gherkinScenarioId of selectedGherkins) {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.generatePostman}?gherkinScenarioId=${gherkinScenarioId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          notify({
            title: "Error",
            description: "AI response wrong.",
            variant: "destructive",
          });
          continue; // Skip this iteration and continue with the next Gherkin scenario
        }
  
        const result = await response.text();
        if (result === "Postman Collection generated successfully!") {
          notify({
            title: "Success",
            description: "Postman Collection generated successfully!",
            variant: "default",
          });
        } else {
          notify({
            title: "Error",
            description: "AI response wrong.",
            variant: "destructive",
          });
        }
      }
  
      // Now call fetchGherkinPostmanPairs once, after all iterations are done
      if (storedQuestionId !== null) {
        await fetchGherkinPostmanPairs(storedQuestionId);
      }
  
    } catch (error) {
      notify({
        title: "API Error",
        description: "An unexpected error occurred while generating Postman scripts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Set loading to false after all iterations are complete
    }
  };

  const generatePostmanScriptMore = async () => {
    if (!selectedGherkins.length) {
      notify({
        title: "No Selection",
        description: "Please select at least one Gherkin Scenario.",
        variant: "default",
      });
      return;
    }
  
    setLoading(true); // Set loading to true before starting the loop
  
    try {
      for (const gherkinScenarioId of selectedGherkins) {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.generatePostmanMore}?gherkinScenarioId=${gherkinScenarioId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          notify({
            title: "Error",
            description: "AI response wrong.",
            variant: "destructive",
          });
          continue; // Skip this iteration and continue with the next Gherkin scenario
        }
  
        const result = await response.text();
        if (result === "Postman Collection generated more and update successfully!") {
          notify({
            title: "Success",
            description: "Postman Collection generated more and update successfully!",
            variant: "default",
          });
        } else {
          notify({
            title: "Error",
            description: "AI response wrong.",
            variant: "destructive",
          });
        }
      }
  
      // Now call fetchGherkinPostmanPairs once, after all iterations are done
      if (storedQuestionId !== null) {
        await fetchGherkinPostmanPairs(storedQuestionId);
      }
  
    } catch (error) {
      notify({
        title: "API Error",
        description: "An unexpected error occurred while generating Postman scripts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Set loading to false after all iterations are complete
    }
  };
  


  //Gherkin Content
  const gherkinContent = loading ? (
    <Skeleton className="h-64 w-full" />
  ) : (
    <div>
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
            <CardContent className="h-32">
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
    <Skeleton className="h-64 w-full" />
  ) : (
    <div>
      {data.map((item: any, index) => (
        <Card key={index} className="mb-4 resize-y overflow-auto">
          <CardHeader>
            <CardTitle>Postman Function: {item.postman?.postmanFunctionName}</CardTitle>
          </CardHeader>
          <CardContent className="h-32">
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
                <div className="text-2xl font-bold tracking-tight">Gherkin Scenario and Postman Script</div>
                <p className="text-muted-foreground">
                  Here's a list of gherkin scenario and postman script of this question!
                </p>             
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Select action for gherkin</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleActionChange("handleGenerateGherkin")}>
                  Generate Gherkin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("handleGenerateGherkinMore")}>
                  Generate Gherkin More
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("Create new Gherkin data")}>
                  Create new Gherkin data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("deleteGherkin")}>
                  Delete Gherkin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Select action for postman</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleActionChange("generatePostmanScript")}>
                  Generate Postman Script
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("generatePostmanScriptMore")}>
                  Generate More test case in postman script
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ),
            right: (
              <>
             
              </>
            ),
          }}

          middle={
            <>
              <div className="flex justify-center p-4 mb-4">
                {questionButtons}
              </div>
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
