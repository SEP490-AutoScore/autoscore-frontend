import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Alert } from "@/components/ui/alert";

import { useToastNotification } from "@/hooks/use-toast-notification";

interface QuestionDetails {
  questionContent?: string;
  examQuestionScore?: number;
  endPoint?: string;
  roleAllow?: string;
  httpMethod?: string;
  description?: string;
  payloadType?: string;
  payload?: string;
  validation?: string;
  sucessResponse?: string;
  errorResponse?: string;
}

interface NewGherkinDataPropsProps {
  onClose: () => void;
  questionId: number | null;
  questionDetails: QuestionDetails | null; 
  fetchGherkinPostmanPairs: (questionId: number) => Promise<void>; 
}

export const NewGherkinDataProps = ({ onClose, questionId, questionDetails, fetchGherkinPostmanPairs }: NewGherkinDataPropsProps) => {
  const [gherkinData, setGherkinData] = useState<string>(""); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const notify = useToastNotification();


  const handleClose = () => {
    setGherkinData(""); 
    setErrorMessage(null); 
    onClose();
  };

  const handleFormSubmit = async () => {
    if (!gherkinData.trim()) {
      setErrorMessage("Gherkin data cannot be empty.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Gửi yêu cầu POST tới API để tạo Gherkin
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.createGherkin}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          gherkinData,
          examQuestionId: questionId,
        }),
      });

      const data = await response.json();

      if (data.gherkinScenarioId) {
      
        notify({
          title: "Successfully",
          description: `Gherkin scenario create Successfully`,
          variant: "default",
        });
          handleClose();
        if (questionId !== null) {
          await fetchGherkinPostmanPairs(questionId); 
        }

      } else {
       
        setErrorMessage("Failed to create Gherkin scenario.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="p-8 bg-white shadow-lg rounded-lg max-w-7xl mx-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">Create Gherkin Format</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Fill in data for the new Gherkin format.
      </DialogDescription>
    </DialogHeader>
  
    {errorMessage && (
      <Alert variant="destructive" className="mt-4">
        {errorMessage}
      </Alert>
    )}
  
    <div className="grid grid-cols-2 gap-6 mt-6">
      {/* Left Column - Gherkin Data */}
      <div className="flex flex-col h-[400px]">
        <Textarea
          value={gherkinData}
          onChange={(e) => setGherkinData(e.target.value)}
          placeholder="Enter your Gherkin data here..."
         className="rounded-lg border border-gray-300 p-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-400 h-full"
         style={{ fontSize: '1rem' }} 
        />
      </div>
  
      {/* Right Column - Question Details */}
      <div className="flex flex-col bg-gray-50 p-4 rounded-lg border h-[400px]  overflow-y-auto">
        {questionDetails ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Question Details</h3>
  
            <p><strong>Content:</strong> {questionDetails?.questionContent || "N/A"}</p>
            <p><strong>Score:</strong> {questionDetails?.examQuestionScore || "N/A"}</p>
            <p><strong>Endpoint:</strong> {questionDetails?.endPoint || "N/A"}</p>
            <p><strong>Role Allow:</strong> {questionDetails?.roleAllow || "N/A"}</p>
            <p><strong>HTTP Method:</strong> {questionDetails?.httpMethod || "N/A"}</p>
            <p><strong>Description:</strong> {questionDetails?.description || "N/A"}</p>
            <p><strong>Payload Type:</strong> {questionDetails?.payloadType || "N/A"}</p>
  
            <div>
              <strong>Payload:</strong>
              <pre className="bg-gray-100 p-2 rounded-md text-sm">
                {questionDetails?.payload || "N/A"}
              </pre>
            </div>
  
            <p><strong>Validation:</strong> {questionDetails?.validation || "N/A"}</p>
  
            <div>
              <strong>Success Response:</strong>
              <pre className="bg-gray-100 p-2 rounded-md text-sm">
                {questionDetails?.sucessResponse || "N/A"}
              </pre>
            </div>
  
            <div>
              <strong>Error Response:</strong>
              <pre className="bg-gray-100 p-2 rounded-md text-sm">
                {questionDetails?.errorResponse || "N/A"}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No question details available.</p>
        )}
      </div>
    </div>
  
    <Button
      onClick={handleFormSubmit}
      disabled={isSubmitting}
      variant="outline"
      className="w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-blue-400 mt-4"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  </DialogContent>
  
  );
};

export default NewGherkinDataProps;