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
import GhekrinDialog, { GherkinDialog } from "./GherkinDialog";
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
  const [selectedQuestionId] = useState<number | null>(null);
  const [storedQuestionId, setStoredQuestionId] = useState<number | null>(null);
  const [isPostmanDialogOpen, setIsPostmanDialogOpen] = useState(false);
  const [selectedPostmanId, setSelectedPostmanId] = useState<number | null>(null);
  const [selectedGherkinId, setSelectedGherkinId] = useState<number | null>(null);
  const [isGherkinDialogOpen, setIsGherkinDialogOpen] = useState(false);
  const [isNewGherkinDialogOpen, setIsNewGherkinDialogOpen] = useState(false);


  const [confirmedIds, setConfirmedIds] = useState<number[]>([]);

  const [isPointCalculationMode, setIsPointCalculationMode] = useState(false);
  const [selectedPostmansCalculationMode, setSelectedPostmansCalculationMode] = useState<number[]>([]);
  const [confirmedPostmansCalculationMode, setConfirmedPostmansCalculationMode] = useState<number[][]>([]);

  const [groupColors, setGroupColors] = useState<Record<number, string>>({});
  const [groupPoints, setGroupPoints] = useState<Record<number, number>>({});




  const handlePointChange = (groupIndex: number, points: number) => {
    setGroupPoints((prev) => ({
      ...prev,
      [groupIndex]: points,
    }));
  };

  const handleSave = async () => {

    const requests = confirmedPostmansCalculationMode.map((group, index) => ({
      postmanForGradingIds: group,
      scorePercentage: groupPoints[index] || 0,
    }));
  
    try {
      setLoading(true);
  
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.saveCalculateScores}?examPaperId=${examPaperId}&examQuestionId=${storedQuestionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requests), // Dữ liệu gửi đi
          
        }
      );
      console.log("Request body:", JSON.stringify(requests));
      if (response.ok) 
        notify({
          title: "Successfully",
          description: "Scores have been successfully saved!",
          variant: "destructive",
      });
   
    }catch (error) {
  
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  
  };
  


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



  const togglePostmanSelectionCalculationMode = (postmanForGradingId: number) => {
    if (!postmanForGradingId || confirmedIds.includes(postmanForGradingId)) return;
    setSelectedPostmansCalculationMode((prevSelected) =>
      prevSelected.includes(postmanForGradingId)
        ? prevSelected.filter((id) => id !== postmanForGradingId)
        : [...prevSelected, postmanForGradingId]
    );
  };
  const handleConfirm = () => {
    if (selectedPostmansCalculationMode.length === 0) return;

    const newColor = getRandomColor(Object.values(groupColors));
    const newGroupId = confirmedPostmansCalculationMode.length; // ID nhóm mới dựa trên thứ tự

    setGroupColors((prev) => ({
      ...prev,
      [newGroupId]: newColor, // Gán màu cho nhóm mới
    }));

    setConfirmedIds((prev) => [...prev, ...selectedPostmansCalculationMode]); // Thêm vào danh sách xác nhận
    setConfirmedPostmansCalculationMode((prev) => [...prev, selectedPostmansCalculationMode]); // Thêm nhóm mới
    setSelectedPostmansCalculationMode([]); // Reset danh sách chọn
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
          throw new Error("Lỗi khi gọi API cho data");
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

    } finally {
      setLoading(false);
    }
  };

  const { deleteGherkin } = useDeleteGherkin({ selectedGherkins, fetchGherkinPostmanPairs, storedQuestionId, token, onLoadingChange: setLoading, });
  const { generateGherkin } = useGenerateGherkin(token, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { generateGherkinMore } = useGenerateGherkinMore(token, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { generatePostmanScript } = useGeneratePostmanScript(token, selectedGherkins, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { generatePostmanScriptMore } = useGeneratePostmanScriptMore(token, selectedGherkins, storedQuestionId, fetchGherkinPostmanPairs, setLoading);
  const { deletePostman } = useDeletePostman(selectedPostmans, token, storedQuestionId, fetchGherkinPostmanPairs, setLoading);

  const handleActionChange = async (action: string) => {
    setSelectedAction(action);

    if (action === "handleGenerateGherkin") {
      await generateGherkin();

    } else if (action === "handleGenerateGherkinMore") {
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
          Question ID {item.examQuestionId}
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


  const randomColors = [
    'border-red-500',
    'border-yellow-500',
    'border-blue-500',
    'border-purple-500',
    'border-pink-500',
    'border-teal-500',
    'border-indigo-500',
    'border-lime-500',
    'border-amber-500',
  ];

  const getRandomColor = (existingColors: string[]): string => {
    const availableColors = randomColors.filter(color => !existingColors.includes(color));
    return availableColors[Math.floor(Math.random() * availableColors.length)];
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
        const isSelected = isPointCalculationMode
          ? selectedPostmansCalculationMode.includes(item.postman?.postmanForGradingId)
          : selectedPostmans.includes(item.postman?.postmanForGradingId);

        const isConfirmed = confirmedIds.includes(item.postman?.postmanForGradingId);

        // Xác định nhóm và màu sắc của Postman
        const groupIndex = confirmedPostmansCalculationMode.findIndex(group =>
          group.includes(item.postman?.postmanForGradingId)
        );
        const color = groupIndex !== -1 ? groupColors[groupIndex] : '';


        return (
          <Card
            key={index}
            className={`mb-4 resize-y overflow-auto cursor-pointer ${isConfirmed
                ? `border-2 ${color} cursor-not-allowed`// Postman đã xác nhận sẽ dùng màu xám nhạt
                : isPointCalculationMode
                  ? isSelected
                    ? 'border-2 border-blue-500' // Postman được chọn sẽ có màu xanh dương
                    : 'border-2 border-gray-300' // Postman chưa được chọn sẽ có viền xám nhạt
                  : isSelected
                    ? 'border-2 border-orange-500' // Tương tự cho chế độ thông thường
                    : item.postman?.examQuestionId === null
                      ? 'border-2 border-red-500' // Trường hợp lỗi
                      : 'border'
              }`}
            onClick={() =>
              isConfirmed
                ? null
                : isPointCalculationMode
                  ? togglePostmanSelectionCalculationMode(item.postman?.postmanForGradingId)
                  : togglePostmanSelection(item.postman?.postmanForGradingId)
            }


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
                    Score of function: {item.postman?.scoreOfFunction}
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

    <SidebarInset>
      {Header}
      <div className="w-full border border-gray-200  rounded-lg">

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
                  <DropdownMenuItem onClick={() => handleActionChange("getGherkinById")}>
                    Show Gherkin Details
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
                  <DropdownMenuItem onClick={() => handleActionChange("getPostmanById")}>
                    Show Postman Details
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />




                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="mt-3 ml-2"
                onClick={() => window.location.reload()}
              >
                <Repeat className="h-4 w-4 " />
                Load
              </Button>
            </>

          }
          topright={
            <>
              <div className="w-full border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-sm font-medium">
                    <strong>Confirmed Postmans:</strong>
                  </div>
                  <div className="space-y-1">
                    {confirmedPostmansCalculationMode.map((group, index) => (
                      <div key={index} className="text-sm">
                        Group {index + 1}: {group.join(", ") || "None"}
                        <div className="mt-2">
                          <label className="text-sm font-medium">
                            Enter points for Group {index + 1}:
                          </label>
                          <input
                            type="number"
                            className="ml-2 border rounded px-2 py-1 w-20 text-sm"
                            placeholder={`Points`}
                            onChange={(e) =>
                              handlePointChange(index, parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-4 mt-2">
                    {isPointCalculationMode ? (
                      <>
                        <Button variant="outline" onClick={handleConfirm}>
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          onClick={async () => {
                            await handleSave(); // Gọi API để lưu điểm
                            setIsPointCalculationMode(false); // Thoát chế độ chỉnh sửa điểm
                          }}
                        >
                          Save
                        </Button>

                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsPointCalculationMode(true)}>
                        PointCalculationSupportMode
                      </Button>
                    )}
                  </div>
                </div>
              </div>
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
