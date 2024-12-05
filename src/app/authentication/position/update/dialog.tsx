import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PositionForm } from "./form";

export function DialogUpdatePosition({ positionId } : { positionId: number; }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Position</DialogTitle>
        <DialogDescription>Update position to system.</DialogDescription>
      </DialogHeader>
      <PositionForm positionId={positionId}/>
    </DialogContent>
  );
}
