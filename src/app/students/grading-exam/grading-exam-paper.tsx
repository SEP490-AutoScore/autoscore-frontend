import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig"; // Assuming you have an Input component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkPermission } from "@/hooks/use-auth";
import { Play } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToastNotification } from "@/hooks/use-toast-notification";

interface ExamPaperIdDialogButtonProps {
  examPaperId: number; // Prop to receive the examPaperId
  examPaperStatus?: string;
}

const ExamPaperIdDialogButton: React.FC<ExamPaperIdDialogButtonProps> = ({
  examPaperId,
  examPaperStatus
}) => {
  const [examType, setExamType] = useState<string>("ASSIGNMENT");
  const [numberDeploy] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to control dialog visibility
  const token = localStorage.getItem("jwtToken");
  const showToast = useToastNotification();

  const handleCancel = () => {
    setIsOpen(false); // Close the dialog
  };

  if (examPaperStatus !== "COMPLETE") {
    return <></>;
  }

  const handleStartGrading = async () => {
    if (numberDeploy < 1) {
      alert("Number Deploy must be at least 1.");
      return;
    }

    const payload = {
      examPaperId,
      examType,
      organizationId: 0, // Replace with actual organizationId if applicable
      numberDeploy: 1,
      memory_Megabyte: 0,
      processors: 0,
    };

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.grading}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start grading.");
      }

      showToast({
        title: "Grading process",
        description: "Your grading process has been created",
        variant: "default",
      });

      setIsOpen(false); // Close the dialog after successful submission
    } catch (error) {
      showToast({
        title: "Grading process",
        description: "Your grading process request fail! Please check and try again!",
        variant: "destructive",
      });
    }
  };
  const hasPermission = checkPermission({ permission: "CREATE_EXAM_PAPER" });
  if (!hasPermission) {
    return <></>;
  }

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="p-2.5 h-10 w-10 rounded-full border-primary text-primary hover:text-white hover:bg-primary"
            >
              <Play />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start Grading</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Dialog that will open when the button is clicked */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Grading</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Exam Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Exam Type</label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSIGNMENT">ASSIGNMENT</SelectItem>
                  <SelectItem value="EXAM">EXAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            {/* Cancel Button */}
            <Button
              className="bg-white text-primary hover:bg-primary hover:text-white border border-primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            {/* Start Grading Button */}
            <Button
              className="bg-primary text-white hover:bg-orange-500"
              onClick={handleStartGrading}
            >
              Start Grading
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExamPaperIdDialogButton;
