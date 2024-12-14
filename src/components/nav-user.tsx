"use client";

import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCookie } from "@/hooks/use-cookie";
import Notification from "@/components/notification/notification-sidebar";
import { Dialog } from "./ui/dialog";
import { DialogProfileAccount } from "@/app/authentication/account/profile-overview/dialog";
import { checkPermission } from "@/hooks/use-auth";
import { useState } from "react";

export function NavUser({
  user,
  selectedItem,
  setSelectedItem,
}: {
  user: {
    name: string;
    position: string;
    avatar: string;
    email: string;
  };
  selectedItem: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { isMobile } = useSidebar();
  const { deleteCookie } = useCookie();
  const [openDialog, setOpenDialog] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    deleteCookie("refreshToken");
    window.location.href = "/";
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.position}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className={`sidebar-link cursor-pointer ${
                    selectedItem === "profile"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => {
                    setOpenDialog(true);
                    setSelectedItem("profile");
                  }}
                  
                  disabled={!checkPermission({ permission: "VIEW_PROFILE" })}
                >
                  <UserCog />
                  Profile
                </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`sidebar-link cursor-pointer`}
                  >
                    <Notification />
                  </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogProfileAccount 
                // permissionId={permission.permissionId}
                // onSuccess={handleCloseDialog}
              />
            </Dialog>
      
    </>
  );
}
