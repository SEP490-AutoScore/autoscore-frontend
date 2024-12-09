"use client";

import { Bell, ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
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
import { CommandShortcut } from "@/components/ui/command";
import { useCookie } from "@/hooks/use-cookie";

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
  const handleLogout = () => {
    localStorage.clear();
    deleteCookie("refreshToken");
    window.location.href = "/";
  };

  return (
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
              <Link to="#@" className="sidebar-link" onClick={() => setSelectedItem("#@")}>
                <DropdownMenuItem className={`sidebar-link cursor-pointer ${
                      selectedItem === "#@"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}>
                  <UserCog />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link to="##@" className="sidebar-link" onClick={() => setSelectedItem("##@")}>
                <DropdownMenuItem className={`sidebar-link cursor-pointer ${
                      selectedItem === "##@"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}>
                  <Bell />
                  Notifications
                  <CommandShortcut>
                    <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                      10
                    </div>
                  </CommandShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
