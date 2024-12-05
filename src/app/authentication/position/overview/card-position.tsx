import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { DialogUpdatePosition } from "../update/dialog";
import { DeleteDialog } from "../delete/dialog";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useNavigate } from "react-router-dom";

interface PositionProps {
  positionId: number;
  name: string;
  description: string;
  status: boolean;
  lastUpdated: string;
  totalUser: number;
}

export function CardPosition({
  positionId,
  name,
  description,
  totalUser,
  lastUpdated,
}: PositionProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDelete = () => {
    fetch(`${BASE_URL}${API_ENDPOINTS.deletePosition}${positionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          showToast({
            title: "Delete Successfully",
            description: "Position deleted successfully.",
          });
          setOpenDeleteDialog(false);
          navigate("/positions", { state: { reload: true } });
        } else {
          if (response.status === 400) {
            showToast({
              title: "Delete Failed",
              description: "Position in use!",
              variant: "destructive",
            });
            return;
          }
          showToast({
            title: "Delete Failed",
            description: "Failed to delete position.",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong",
          description: "Failed to delete position.",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Position Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDialog(true)}
              >
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter>
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between">
              <p>{totalUser}</p>
              <p>{formatDate(lastUpdated)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Participants</p>
              <p className="text-muted-foreground">Last Updated</p>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogUpdatePosition positionId={positionId} />
      </Dialog>

      <DeleteDialog
        open={openDeleteDialog} // Truyền trạng thái
        onOpenChange={setOpenDeleteDialog} // Đồng bộ trạng thái
        onDeleteConfirm={handleDelete} // Hành động khi confirm
      />
    </>
  );
}
