import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog } from "@/components/ui/dialog";
import { DialogCreateOrganization } from "../create/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { DialogUpdateOrganization } from "../update/dialog";
import { DeleteDialog } from "../delete/dialog";
import { useNavigate } from "react-router-dom";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";

type Organization = {
  organizationId: number;
  name: string;
  type: string;
  parentId: number | null;
  status: boolean;
  children?: Organization[];
};

interface TreeNodeProps {
  node: Organization;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const handleDelete = () => {
    fetch(
      `${BASE_URL}${API_ENDPOINTS.deleteOrganization}${node.organizationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          showToast({
            title: "Delete Successfully",
            description: "Node deleted successfully.",
          });
          setOpenDeleteDialog(false);
          navigate("/organizations", { state: { reload: true } });
        } else {
          if (response.status === 400) {
            showToast({
              title: "Delete Failed",
              description: "Node in use! Node is associated with a organization.",
              variant: "destructive",
            });
            return;
          }
          if (response.status === 409) {
            showToast({
              title: "Delete Failed",
              description: "Node child in use! Node child is associated with a organization.",
              variant: "destructive",
            });
            return;
          }
          showToast({
            title: "Delete Failed",
            description: "Failed to delete node.",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong",
          description: "Failed to delete node.",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <ContextMenu>
            <ContextMenuTrigger>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div
                      className="flex items-center py-3 px-2 cursor-pointer rounded-md"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {node.children?.length ? (
                        isOpen ? (
                          <ChevronDownIcon className="w-5 h-5 text-primary mr-2" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5 text-primary mr-2" />
                        )
                      ) : (
                        <div className="w-5 h-5 mr-2"></div>
                      )}
                      <span className="text-gray-800 font-medium">
                        {node.name}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{node.type}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>Organization Actions</ContextMenuLabel>
              <ContextMenuSeparator />
              {node.type === "DEPARTMENT" ? (
                <ContextMenuItem
                  className="cursor-pointer"
                  onClick={() => setOpenDialog(true)}
                  disabled
                >
                  Add New
                </ContextMenuItem>
              ) : (
                <ContextMenuItem
                  className="cursor-pointer"
                  onClick={() => setOpenDialog(true)}
                >
                  Add New
                </ContextMenuItem>
              )}
              <ContextMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDialogUpdate(true)}
              >
                Update Node
              </ContextMenuItem>
              <ContextMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "auto" : 0 }}
          className="flex justify-center overflow-hidden mt-4"
        >
          {node.children && (
            <div className="flex justify-center gap-6 border-t-2 border-gray-200 pt-4">
              {node.children.map((child) => (
                <TreeNode key={child.organizationId} node={child} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogCreateOrganization
          type={
            node.children?.length
              ? node.children[0].type
              : node.type === "CAMPUS"
              ? "MAJOR"
              : node.type === "MAJOR"
              ? "DEPARTMENT"
              : "NEW NODE"
          }
          parentId={node.organizationId}
          parentName={node.name}
        />
      </Dialog>
      <Dialog open={openDialogUpdate} onOpenChange={setOpenDialogUpdate}>
        <DialogUpdateOrganization organizationId={node.organizationId} />
      </Dialog>
      <DeleteDialog
        open={openDeleteDialog} // Truyền trạng thái
        onOpenChange={setOpenDeleteDialog} // Đồng bộ trạng thái
        onDeleteConfirm={handleDelete} // Hành động khi confirm
      />
    </>
  );
};

interface TreeViewProps {
  data: Organization[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {data.map((node) => (
        <TreeNode key={node.organizationId} node={node} />
      ))}
    </div>
  );
};

export default TreeView;
