import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReasonDialogProps {
  reason: string;
  trigger: React.ReactNode;
}

export function ReasonDialog({ reason, trigger }: ReasonDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Reason</DialogTitle>
          <DialogDescription>Explanation for the score</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow mt-4">
          <pre
            className="text-sm whitespace-pre-wrap break-words"
          >
            {reason ? reason : "No result"}
          </pre>
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

