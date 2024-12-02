import {
    Dialog,
    DialogContent,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  export function DeleteDialog({
    open,
    onOpenChange,
    onDeleteConfirm,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleteConfirm: () => void;
  }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
          <p>
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" className="border-primary text-primary" onClick={() => onOpenChange(false)}>
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
      </Dialog>
    );
  }
  