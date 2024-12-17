import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleForm } from "./form";

export function DialogCreateRole() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Role</DialogTitle>
        <DialogDescription>Add a new role to system.</DialogDescription>
      </DialogHeader>
        <RoleForm />
    </DialogContent>
  );
}
