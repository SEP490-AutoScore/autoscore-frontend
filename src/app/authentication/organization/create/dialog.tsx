import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./form";

export function DialogCreateOrganization({
  type,
  parentId,
  parentName,
}: {
  type: string;
  parentId: number;
  parentName: string;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</DialogTitle>
        <DialogDescription>
          Add a new <span className="font-semibold text-primary">{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</span>{" "}
          to <span className="font-semibold text-primary">{parentName}</span>.
        </DialogDescription>
      </DialogHeader>
      <OrganizationForm
        type={type}
        parentId={parentId}
      />
    </DialogContent>
  );
}
