import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PermissionForm } from "./form";

export function DialogPermission({ permissionId, onSuccess }: { permissionId: number; onSuccess: () => void; }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Permission</DialogTitle>
        <DialogDescription>
          Update permission to system.
        </DialogDescription>
      </DialogHeader>
      <PermissionForm permissionId={permissionId} onSuccess={onSuccess}/>
    </DialogContent>
  );
}
