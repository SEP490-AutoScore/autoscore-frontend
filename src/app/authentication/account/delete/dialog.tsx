import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteDialog({
  open,
  onOpenChange,
  onDeleteConfirm,
  status,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteConfirm: () => void;
  status: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {status === "Active" ? (
        <DialogContent>
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
          <p>Are you sure you want to delete this item?</p>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-primary text-primary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDeleteConfirm();
                onOpenChange(false); // Đóng dialog sau khi xác nhận
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent>
          <h3 className="text-lg font-bold">Confirm Restore</h3>
          <p>Are you sure you want to restore this item?</p>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-primary text-primary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-secondary text-white bg-secondary hover:bg-primary hover:border-primary"
              onClick={() => {
                onDeleteConfirm();
                onOpenChange(false); // Đóng dialog sau khi xác nhận
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
