import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PermissionForm } from "./form";

export function DialogPermission() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Permission</DialogTitle>
        <DialogDescription>Add a new permission to system.</DialogDescription>
      </DialogHeader>
        <PermissionForm />
    </DialogContent>
  );
}
