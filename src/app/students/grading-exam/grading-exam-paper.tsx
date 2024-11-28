// ExamPaperIdDialogButton.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExamPaperIdDialogButtonProps {
  examPaperId: number; // Prop to receive the examPaperId
}

const ExamPaperIdDialogButton: React.FC<ExamPaperIdDialogButtonProps> = ({ examPaperId }) => {
  return (
    <Dialog>
      {/* Button that triggers the dialog */}
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Start Grading
        </Button>
      </DialogTrigger>

      {/* Dialog that will open when the button is clicked */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Grading</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Number Deploy</label>
            {/* Add your input or content here */}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Exam Type</label>
            {/* Add your input or content here */}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Memory (MB)</label>
            {/* Add your input or content here */}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <Button
            className="bg-white text-black hover:bg-orange-500 hover:text-white border border-gray-300"
            onClick={() => {/* Handle cancel logic here */}}
          >
            Cancel
          </Button>
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => {/* Handle start grading logic here */}}
          >
            Start Grading
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamPaperIdDialogButton;
