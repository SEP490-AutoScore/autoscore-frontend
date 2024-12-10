import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";// Assuming you have an Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExamPaperIdDialogButtonProps {
  examPaperId: number; // Prop to receive the examPaperId
}

const ExamPaperIdDialogButton: React.FC<ExamPaperIdDialogButtonProps> = ({ examPaperId }) => {
  const [examType, setExamType] = useState<string>("ASSIGNMENT");
  const [numberDeploy] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to control dialog visibility
  const token = localStorage.getItem("jwtToken");

  const handleCancel = () => {
    setIsOpen(false); // Close the dialog
  };

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

      alert("Grading started successfully!");
      setIsOpen(false); // Close the dialog after successful submission
    } catch (error) {
      alert(`Error`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Button that triggers the dialog */}
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button
            className="bg-white text-black hover:bg-orange-500 hover:text-white"
            onClick={() => setIsOpen(true)}
          >
            Start Grading
          </Button>
        </div>
      </DialogTrigger>

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

        <div className="flex justify-end space-x-4 mt-4">
          {/* Cancel Button */}
          <Button
            className="bg-white text-black hover:bg-orange-500 hover:text-white border border-gray-300"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          {/* Start Grading Button */}
          <Button
            className="bg-white text-black hover:bg-orange-500 hover:text-white border border-gray-300"
            onClick={handleStartGrading}
          >
            Start Grading
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamPaperIdDialogButton;
