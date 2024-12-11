import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogRunPostmanDialogProps {
  logRunPostman: string | null;
  open: boolean;
  onClose: () => void;
}

const LogRunPostmanDialog: React.FC<LogRunPostmanDialogProps> = ({
  logRunPostman,
  open,
  onClose
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="p-6 bg-white shadow-lg rounded-lg mx-auto w-[95%] max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Log File Collection Postman Data
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Details of the log file collection associated with the Postman data.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-auto resize-y max-h-[60vh]">
          {logRunPostman !== null ? (
            <pre className="text-sm text-gray-700 bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              <strong className="font-semibold">Log File Collection Value:</strong>
              {"\n"}
              {logRunPostman}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No data available.</p>
          )}
        </div>

        <Button onClick={onClose} variant="outline" className="w-full mt-6">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LogRunPostmanDialog;
