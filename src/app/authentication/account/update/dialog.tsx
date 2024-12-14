import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from "./form";

export function DialogUpdateAccount({ accountId, onSuccess } : { accountId: number; onSuccess: () => void; }) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Account</DialogTitle>
        <DialogDescription>
          Update account to system.
        </DialogDescription>
      </DialogHeader>
      <AccountForm id={accountId} onSuccess={onSuccess}
      />
    </DialogContent>
  );
}
