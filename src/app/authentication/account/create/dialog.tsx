import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from "./form";

export function DialogCreateAccount() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Account</DialogTitle>
        <DialogDescription>
          Add a new account to system.
        </DialogDescription>
      </DialogHeader>
      <AccountForm
      />
    </DialogContent>
  );
}
