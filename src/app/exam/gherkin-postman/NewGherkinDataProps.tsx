import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Alert } from "@/components/ui/alert";

import { useToastNotification } from "@/hooks/use-toast-notification";

interface NewGherkinDataPropsProps {
  onClose: () => void;
  questionId: number | null;
  fetchGherkinPostmanPairs: (questionId: number) => Promise<void>; 
}

export const NewGherkinDataProps = ({ onClose, questionId, fetchGherkinPostmanPairs }: NewGherkinDataPropsProps) => {
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
    <DialogContent className="p-8 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
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

      <div className="space-y-6 mt-6">
        <p className="text-sm">Question ID: {questionId}</p>

        <Textarea
          value={gherkinData}
          onChange={(e) => setGherkinData(e.target.value)}
          placeholder="Enter your Gherkin data here..."
          className="rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400"
          rows={6}
        />
        <Button
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          variant="outline"
          className="w-full py-3 text-lg font-semibold shadow-md focus:ring-2 focus:ring-blue-400"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default NewGherkinDataProps;
