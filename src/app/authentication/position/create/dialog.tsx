import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PositionForm } from "./form";

export function DialogCreatePosition() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Position</DialogTitle>
        <DialogDescription>Add a new position to system.</DialogDescription>
      </DialogHeader>
        <PositionForm />
    </DialogContent>
  );
}
