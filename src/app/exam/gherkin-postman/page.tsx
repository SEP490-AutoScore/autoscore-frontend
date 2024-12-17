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
import { checkPermission } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Repeat, Settings2 } from "lucide-react";
import PostmanDialog from "./PostmanDialog";
import { GherkinDialog } from "./GherkinDialog";
import { useDeleteGherkin } from "./useDeleteGherkin";
import { useGenerateGherkin } from "./useGenerateGherkin";
import { useGenerateGherkinMore } from "./useGenerateGherkinMore";
import { useGeneratePostmanScript } from "./useGeneratePostmanScript";
import { useGeneratePostmanScriptMore } from "./useGeneratePostmanScriptMore";
import { useDeletePostman } from "./useDeletePostman";

const GherkinPostmanPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [selectedGherkins, setSelectedGherkins] = useState<number[]>([]);
  const [selectedPostmans, setSelectedPostmans] = useState<number[]>([]);
  const [, setSelectedAction] = useState<string>("");
  const notify = useToastNotification();
  const token = localStorage.getItem("jwtToken");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { examId, examPaperId } = location.state || {};
  const [questions, setQuestions] = useState<any[]>([]);
  const [storedQuestionId, setStoredQuestionId] = useState<number | null>(null);
  const [isPostmanDialogOpen, setIsPostmanDialogOpen] = useState(false);
  const [selectedPostmanId, setSelectedPostmanId] = useState<number | null>(null);
  const [selectedGherkinId, setSelectedGherkinId] = useState<number | null>(null);
  const [isGherkinDialogOpen, setIsGherkinDialogOpen] = useState(false);
  const [isNewGherkinDialogOpen, setIsNewGherkinDialogOpen] = useState(false);

  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: "Exam Details",
    breadcrumbLink_2: "/exams/exam-papers",
    breadcrumbPage_3: "Gherkin Postman",
    stateGive: { examId: examId },
  });

  const toggleGherkinSelection = (gherkinScenarioId: number) => {
    if (!gherkinScenarioId) return;
    setSelectedGherkins((prevSelected) =>
      prevSelected.includes(gherkinScenarioId)
        ? prevSelected.filter((id) => id !== gherkinScenarioId)
        : [...prevSelected, gherkinScenarioId]
    );
  };

  const togglePostmanSelection = (postmanForGradingId: number) => {
    if (!postmanForGradingId) return;
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
        const dataResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.gherkinScenarioPairs}${examPaperId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!dataResponse.ok) {
          throw new Error("Error");
        }
        const Data = await dataResponse.json();
        setData(Data);
        const questionsResponse = await fetch(`${BASE_URL}${API_ENDPOINTS.getQuestions}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examPaperId }),
        });
        if (!questionsResponse.ok) {
          throw new Error("Error call API for questions");
        }
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error call API:", error);
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
        throw new Error("Error call API");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const { deleteGherkin } = useDeleteGherkin({ selectedGherkins, fetchGherkinPostmanPairs, storedQuestionId, token, onLoadingChange: setLoading, examPaperId });
  const { generateGherkin } = useGenerateGherkin(token, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { generateGherkinMore } = useGenerateGherkinMore(token, storedQuestionId, selectedGherkins, fetchGherkinPostmanPairs, setLoading);
  const { generatePostmanScript } = useGeneratePostmanScript(token, selectedGherkins, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { generatePostmanScriptMore } = useGeneratePostmanScriptMore(token, selectedPostmans, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { deletePostman } = useDeletePostman(selectedPostmans, token, storedQuestionId, fetchGherkinPostmanPairs, setLoading, examPaperId);

  const handleActionChange = async (action: string) => {
    setSelectedAction(action);
    if (action === "handleGenerateGherkin") {
      await generateGherkin();
    }
    else if (action === "selectAllGherkin") {
      const allGherkinIds = data
        .filter((item: any) => item.gherkin?.gherkinScenarioId)
        .map((item: any) => item.gherkin.gherkinScenarioId);
      setSelectedGherkins(allGherkinIds);
      notify({
        title: "Gherkin Selection",
        description: "All Gherkin scenarios have been selected.",
        variant: "default",
      });
    } else if (action === "deselectAllGherkin") {
      setSelectedGherkins([]);
      notify({
        title: "Gherkin Selection",
        description: "All Gherkin scenarios have been deselected.",
        variant: "default",
      });
    }
    else if (action === "selectAllPostman") {
      const allPostmanIds = data
        .filter((item: any) => item.postman?.postmanForGradingId)
        .map((item: any) => item.postman.postmanForGradingId);
      setSelectedPostmans(allPostmanIds);
      notify({
        title: "Postman Selection",
        description: "All Postman script info have been selected.",
        variant: "default",
      });
    }
    else if (action === "deselectAllPostman") {
      setSelectedPostmans([]);
      notify({
        title: "Postman Selection",
        description: "All Postman script info have been deselected.",
        variant: "default",
      });
    }
    else if (action === "handleGenerateGherkinMore") {
      await generateGherkinMore();
    }
    else if (action === "newGherkinData") {
      if (storedQuestionId === null) {
        notify({
          title: "Validation Error",
          description: "Please select a question",
          variant: "destructive",
        });
      } else {
        setIsNewGherkinDialogOpen(true);
      }
    }
    else if (action === "deleteGherkin") {
      deleteGherkin();
    }
    else if (action === "getGherkinById") {
      const gherkinScenarioId = selectedGherkins[0];
      if (!gherkinScenarioId) {
        notify({
          title: "Validation Error",
          description: "Please select a Gherkin item to view details",
          variant: "destructive",
        });
        return;
      }
      setSelectedGherkinId(gherkinScenarioId);
      setIsGherkinDialogOpen(true);
    }
    else if (action === "generatePostmanScript") {
      await generatePostmanScript();
    }
    else if (action === "generatePostmanScriptMore") {
      await generatePostmanScriptMore();
    }
    else if (action === "deletePostman") {
      await deletePostman();
    }
    else if (action === "getPostmanById") {
      const postmanId = selectedPostmans[0];
      if (!postmanId) {
        notify({
          title: "Validation Error",
          description: "Please select a Postman item to view details",
          variant: "destructive",
        });
        return;
      }
      setSelectedPostmanId(postmanId);
      setIsPostmanDialogOpen(true);
    }
  };

  const handleQuestionClick = (questionId: number) => {
    setStoredQuestionId(questionId);
    fetchGherkinPostmanPairs(questionId);
  };

  const questionButtons = (
    <div className="flex flex-wrap gap-2">
      {questions.map((item) => (
        <Button
          key={item.examQuestionId}
          variant={storedQuestionId === item.examQuestionId ? "default" : "outline"}
          onClick={() => handleQuestionClick(item.examQuestionId)}
          className="w-1/8"
        >
          {item.httpMethod} {item.endPoint}
        </Button>
      ))}
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

  const gherkinContent = loading ? (
    <Skeleton className="h-64 w-full" />
  ) : (
    <div>
      {data.map((item: any, index) => {
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
                Gherkin Data:
              </CardTitle>
            </CardHeader>
            <CardContent className="h-32">
              {item.gherkin ? (
                <>
                  <pre className="text-sm whitespace-pre-wrap">
                    {item.gherkin?.gherkinData}
                  </pre>
                </>
              ) : (
                <p className="italic text-gray-500">No Gherkin data available.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const postmanContent = loading ? (
    <Skeleton className="h-64 w-full" />
  ) : (
    <div>
      {data.map((item: any, index) => {
        const isSelected = selectedPostmans.includes(item.postman?.postmanForGradingId);

        return (
          <Card
            key={index}
            className={`mb-4 resize-y overflow-auto cursor-pointer 
                  ${isSelected
                ? "border-2 border-orange-500"
                : item.postman?.examQuestionId === null
                  ? "border-2 border-red-500"
                  : "border"
              }`}
            onClick={() => togglePostmanSelection(item.postman?.postmanForGradingId)}
          >
            <CardHeader>
              <CardTitle>
                Postman Function: {item.postman?.postmanFunctionName}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-32">
              {item.postman ? (
                <>
                  <p className="text-sm">
                    Score of function: {parseFloat((item.postman?.scoreOfFunction ?? 0).toFixed(2))}
                  </p>
                  <p className="text-sm">
                    Score Percentage: {parseFloat((item.postman?.scorePercentage ?? 0).toFixed(1))} %
                  </p>
                  <p className="text-sm">
                    Total PM Tests: {item.postman?.totalPmTest}
                  </p>
                  <pre className="text-sm whitespace-pre-wrap bg-gray-200 p-2 rounded">
                    {JSON.stringify(JSON.parse(item.postman.fileCollectionPostman), null, 2)}
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
        );

      })}
    </div>
  );

  return (
    <SidebarInset className="overflow-x-hidden">
      {Header}
      <div className="w-full border border-gray-200 rounded-lg" style={{ marginLeft: "1rem", marginRight: "1rem", marginBottom: "1rem", maxWidth: "calc(100% - 2rem)" }}>
        <GherkinPostmanLayout
          topleft={
            <>
              <div className="text-2xl font-bold tracking-tight">Gherkin Scenario and Postman Script</div>
              <p className="text-muted-foreground">
                Here's a list of gherkin scenario and postman script!
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="mt-3 ml-auto">
                    <Settings2 className="h-4 w-4" />
                    List Action
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-50">
                  <DropdownMenuLabel>For Gherkin Scenario</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleActionChange("selectAllGherkin")}>
                    Select All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("deselectAllGherkin")}>
                    Deselect All
                  </DropdownMenuItem>

                  {checkPermission({ permission: "GENERATE_GHERKIN_SCENARIO" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("handleGenerateGherkin")}>
                      Generate Gherkin Scenario
                    </DropdownMenuItem>
                  )}

                  {checkPermission({ permission: "GENERATE_GHERKIN_SCENARIO" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("handleGenerateGherkinMore")}>
                      Generate More
                    </DropdownMenuItem>
                  )}
                  {checkPermission({ permission: "DELETE_GHERKIN_SCENARIO" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("deleteGherkin")}>
                      Delete
                    </DropdownMenuItem>
                  )}
                  {checkPermission({ permission: "CREATE_GHERKIN_SCENARIO" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("newGherkinData")}>
                      New Gherkin Scenario
                    </DropdownMenuItem>
                  )}
                  {checkPermission({ permission: "VIEW_GHERKIN_POSTMAN" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("getGherkinById")}>
                      Show Details
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>For Postman Script</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleActionChange("selectAllPostman")}>
                    Select All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionChange("deselectAllPostman")}>
                    Deselect All
                  </DropdownMenuItem>
                  {checkPermission({ permission: "GENERATE_POSTMAN" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("generatePostmanScript")}>
                      Generate Postman Script
                    </DropdownMenuItem>
                  )}
                  {checkPermission({ permission: "GENERATE_POSTMAN" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("generatePostmanScriptMore")}>
                      Generate More Test Case
                    </DropdownMenuItem>
                  )}
                  {checkPermission({ permission: "DELETE_POSTMAN" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("deletePostman")}>
                      Delete
                    </DropdownMenuItem>
                  )}
                  {checkPermission({ permission: "VIEW_GHERKIN_POSTMAN" }) && (
                    <DropdownMenuItem onClick={() => handleActionChange("getPostmanById")}>
                      Show Details
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="mt-3 ml-2"
                onClick={() => window.location.reload()}
              >
                <Repeat className="h-4 w-4 " />
                Show All
              </Button>
            </>
          }
          middle={
            <>
              <div className="flex justify-center p-4">
                {questionButtons}
              </div>
              <div className="flex justify-center mb-4">
                <div
                  className="w-full max-w-7xl h-96 overflow-auto resize-y border border-gray-300 rounded-lg p-4"
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
          questionDetails={questions.find((q) => q.examQuestionId === storedQuestionId) || null} // Pass question details
        />
      </Dialog>
      <Dialog open={isPostmanDialogOpen} onOpenChange={() => setIsPostmanDialogOpen(false)}>
        <PostmanDialog
          onClose={() => setIsPostmanDialogOpen(false)}
          postmanId={selectedPostmanId}
          storedQuestionId={storedQuestionId}
          fetchGherkinPostmanPairs={fetchGherkinPostmanPairs}
        />
      </Dialog>
      <Dialog open={isGherkinDialogOpen} onOpenChange={() => setIsGherkinDialogOpen(false)}>
        <GherkinDialog
          onClose={() => setIsGherkinDialogOpen(false)}
          gherkinScenarioId={selectedGherkinId}
          storedQuestionId={storedQuestionId}
          fetchGherkinPostmanPairs={fetchGherkinPostmanPairs}
        />
      </Dialog>
    </SidebarInset>
  );
};
export default GherkinPostmanPage;
