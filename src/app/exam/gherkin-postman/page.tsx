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
import NewGherkinDataProps from "./NewGherkinDataProps";
import { Dialog } from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";

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

  const [selectedGherkins, setSelectedGherkins] = useState<number[]>([]);
  const [selectedPostmans, setSelectedPostmans] = useState<number[]>([]);
  const [, setSelectedAction] = useState<string>("");
  const [loading, setLoading] = useState(true);



  const notify = useToastNotification();

  const token = localStorage.getItem("jwtToken");
  const location = useLocation();
  const { examId, examPaperId } = location.state || {};
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestionId] = useState<number | null>(null);
  const [storedQuestionId, setStoredQuestionId] = useState<number | null>(null);
  const [isNewGherkinDialogOpen, setIsNewGherkinDialogOpen] = useState(false);


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

  const toggleGherkinSelection = (gherkinScenarioId: number) => {
    if (!gherkinScenarioId) return; // Nếu Gherkin không hợp lệ, không cho chọn
    setSelectedGherkins((prevSelected) =>
      prevSelected.includes(gherkinScenarioId)
        ? prevSelected.filter((id) => id !== gherkinScenarioId)
        : [...prevSelected, gherkinScenarioId]
    );
  };

  const togglePostmanSelection = (postmanForGradingId: number) => {
    if (!postmanForGradingId) return; // Nếu Postman không hợp lệ, không cho chọn
    setSelectedPostmans((prevSelected) =>
      prevSelected.includes(postmanForGradingId)
        ? prevSelected.filter((id) => id !== postmanForGradingId)
        : [...prevSelected, postmanForGradingId]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        return;
      }


      try {
        setLoading(true);
  
        // Gọi API đầu tiên
        const dataResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairs}${examPaperId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!dataResponse.ok) {
          throw new Error("Lỗi khi gọi API cho data");
        }
  
        const Data = await dataResponse.json();
        setData(Data);
  
        // Gọi API thứ hai
        const questionsResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.getQuestions}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examPaperId }),
        });
  
        if (!questionsResponse.ok) {
          throw new Error("Lỗi khi gọi API cho questions");
        }
  
        const questionsData = await questionsResponse.json();
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

  const fetchGherkinPostmanPairs = async (questionId: number) => {
    if (!token || questionId === null) return;

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
    } else if (action === "handleGenerateGherkinMore") {
      handleGenerateGherkinMore();

    }
    else if (action === "deleteGherkin") {
      deleteGherkin();
    }
    else if (action === "newGherkinData") {
      if (storedQuestionId === null) {

        notify({
          title: "Validation Error",
          description: "Please select question",
          variant: "destructive",
        });
      } else {

        setIsNewGherkinDialogOpen(true);
      }
    }
    else if (action === "generatePostmanScript") {
      generatePostmanScript();
    }
    else if (action === "generatePostmanScriptMore") {
      generatePostmanScriptMore();
    }
    else if (action === "deletePostman") {
      deletePostman();
    }
  };


  const handleQuestionClick = (questionId: number) => {
    setStoredQuestionId(questionId); // Set the selected question ID
    fetchGherkinPostmanPairs(questionId); // Fetch Gherkin-Postman pairs for the selected question immediately
  };


  // Render buttons for each question
  const questionButtons = (
    <div className="flex flex-wrap gap-2">
      {questions.map((item) => (
        <Button
          key={item.examQuestionId}
          variant={storedQuestionId === item.examQuestionId ? "default" : "outline"}
          onClick={() => handleQuestionClick(item.examQuestionId)}
          className="w-1/8"
        >
          Question {item.examQuestionId}
        </Button>
      ))}
    </div>
  );



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
          description: "Failed to generate Gherkin format. Maybe cause by has not database",
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
          description: "Failed to generate Gherkin format. Maybe api key wrong or has not database",
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
          continue;
        }

        const result = await response.json();

        if (result.gherkinScenarioId) {
          notify({
            title: "Success",
            description: `Deleted Gherkin Scenario successfully.`,
            variant: "default",
          });
        } else {
          notify({
            title: "Error",
            description: `Failed to delete Gherkin Scenario`,
            variant: "destructive",
          });
        }
      }

      //Làm mới dữ liệu sau khi xóa
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
            description: "AI not response, may be ai key wrong",
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

  const deletePostman = async () => {
    if (!selectedPostmans.length) {
      notify({
        title: "Validation Error",
        description: "Please select at least one Postman script to delete.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Duyệt qua từng Postman script ID để xóa
      for (const postmanId of selectedPostmans) {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.deletePostman}?postmanForGradingId=${postmanId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );



        if (!response.ok) {
          continue;
        }
        const responseText = await response.text();

        if (responseText.includes("successfully")) {
          notify({
            title: "Success",
            description: `Deleted Postman script successfully.`,
            variant: "default",
          });
        }
        else {
          notify({
            title: "Error",
            description: `Failed to delete Postman script.`,
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




  //Gherkin Content
  const gherkinContent = loading ? (
    <Skeleton className="h-64 w-full" />
  ) : (
    <div>
      {data.map((item: any, index) => {
        // Kiểm tra dữ liệu Gherkin có hợp lệ hay không
        const isSelected = selectedGherkins.includes(item.gherkin?.gherkinScenarioId);


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
                Scenario ID: {item.gherkin?.gherkinScenarioId}
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
      {data.map((item: any, index) => {
        // Kiểm tra dữ liệu Postman có hợp lệ hay không
        const isSelected = selectedPostmans.includes(item.postman?.postmanForGradingId);

        return (
          <Card
            key={index}
            className={`mb-4 resize-y overflow-auto cursor-pointer ${isSelected ? "border-2 border-orange-500" : "border"
              }`}
            onClick={() => togglePostmanSelection(item.postman?.postmanForGradingId)}
          >
            <CardHeader>

              <CardTitle>
                Postman ID: {item.postman?.postmanForGradingId} - Postman Function: {item.postman?.postmanFunctionName}

              </CardTitle>
            </CardHeader>
            <CardContent className="h-32">
              {item.postman ? (
                <>
                  <p className="text-sm">
                    Total PM Tests: {item.postman?.totalPmTest}
                  </p>
                  <pre className="text-sm whitespace-pre-wrap bg-gray-200 p-2 rounded">

                    {item.postman?.fileCollectionPostman}
                  </pre>
                  <p className="text-sm">
                    Status: {item.postman?.status ? "Active" : "Inactive"}
                  </p>
                  <p className="text-sm">
                    Gherkin ID: {item.postman?.gherkinScenarioId}
                  </p>
                  <p className="text-sm">
                     Question: {item.postman?.examQuestionId}
                  </p>
                </>
              ) : (
                <p className="italic text-gray-500">No Postman data available.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );



  const renderQuestionDetails = () => {
    if (!storedQuestionId) {
      return <p className="text-center text-gray-600">Select a question to view its details.</p>;
    }

    const selectedQuestion = questions.find((q) => q.examQuestionId === storedQuestionId);

    if (!selectedQuestion) {
      return <p className="text-center text-red-600">Details not available for this question.</p>;
    }

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Question Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Question Content:</span>
            <span className="text-gray-900">{selectedQuestion.questionContent}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Score:</span>
            <span className="text-gray-900">{selectedQuestion.examQuestionScore}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Endpoint:</span>
            <span className="text-gray-900">{selectedQuestion.endPoint}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Allowed Roles:</span>
            <span className="text-gray-900">{selectedQuestion.roleAllow}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">HTTP Method:</span>
            <span className="text-gray-900">{selectedQuestion.httpMethod}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-gray-900">{selectedQuestion.description}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Payload Type:</span>
            <span className="text-gray-900">{selectedQuestion.payloadType}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Payload:</span>
            <pre className="bg-gray-100 p-2 rounded-md text-sm">{selectedQuestion.payload}</pre>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Validation:</span>
            <span className="text-gray-900">{selectedQuestion.validation}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Success Response:</span>
            <pre className="bg-gray-100 p-2 rounded-md text-sm">{selectedQuestion.sucessResponse}</pre>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Error Response:</span>
            <pre className="bg-gray-100 p-2 rounded-md text-sm">{selectedQuestion.errorResponse}</pre>
          </div>
        </div>
      </div>
    );
  };



  return (

    <SidebarInset>
      {Header}
      <div className="w-full border border-gray-200  rounded-lg">

        <GherkinPostmanLayout

          top={

            <>
              <div className="text-2xl font-bold tracking-tight">Gherkin Scenario and Postman Script</div>
              <p className="text-muted-foreground">
                Here's a list of gherkin scenario and postman script!
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Settings2 className="h-4 w-4" />
                    List action
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-50">
                  <DropdownMenuLabel>List action for gherkin</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleActionChange("handleGenerateGherkin")}>
                    Generate Gherkin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("handleGenerateGherkinMore")}>
                    Generate Gherkin More
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleActionChange("deleteGherkin")}>
                    Delete Gherkin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("newGherkinData")}>
                    New Gherkin Data
                  </DropdownMenuItem>


                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>List action for postman</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleActionChange("generatePostmanScript")}>
                    Generate Postman Script
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("generatePostmanScriptMore")}>
                    Generate More test case in postman script
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("deletePostman")}>
                    Delete Postman
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>


          }

          middle={
            <>
              <div className="flex justify-center p-4">
                {questionButtons}
              </div>
              <div className="flex justify-center mb-4">
                <div
                  className="w-full max-w-4xl h-48 overflow-auto resize-y border border-gray-300 rounded-lg p-4"
                  style={{ resize: 'vertical' }}
                >
                  {renderQuestionDetails()}
                </div>
              </div>

            </>
          }


          left={gherkinContent}

          right={postmanContent}
        />


      </div>

      <Dialog open={isNewGherkinDialogOpen} onOpenChange={setIsNewGherkinDialogOpen}>
        <NewGherkinDataProps
          onClose={() => setIsNewGherkinDialogOpen(false)}
          questionId={storedQuestionId}
          fetchGherkinPostmanPairs={fetchGherkinPostmanPairs}

        />
      </Dialog>
    </SidebarInset>

  );

};

export default GherkinPostmanPage;
