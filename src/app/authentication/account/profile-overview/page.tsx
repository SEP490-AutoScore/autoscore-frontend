import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Profile } from "./profile";

export function ProfilePage({ id } : { id: number; }) {
  return (
    <DialogContent className="sm:max-w-[800px] w-[90vw]">
      <DialogHeader>
        <DialogTitle>Profile Information</DialogTitle>
        <DialogDescription>
          View and update your profile information here.
        </DialogDescription>
      </DialogHeader>
      <Profile id={id}/>
    </DialogContent>
  );
}