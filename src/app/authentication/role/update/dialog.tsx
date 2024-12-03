import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleForm } from "./form";

export function DialogUpdateRole({ roleId } : { roleId: number; }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Role</DialogTitle>
        <DialogDescription>Update role to system.</DialogDescription>
      </DialogHeader>
      <RoleForm roleId={roleId}/>
    </DialogContent>
  );
}
