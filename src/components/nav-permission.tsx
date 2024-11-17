"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavPermission({
  items,
  selectedItem,
  setSelectedItem,
  role,
  permissions,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    allowedRoles?: string[];
    permission?: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  selectedItem: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  role: string;
  permissions: string[];
}) {
  // Load initial state from localStorage
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    () => {
      const storedStates = localStorage.getItem("navPermissionActiveStates");
      return storedStates ? JSON.parse(storedStates) : {};
    }
  );

  // Update localStorage whenever activeStates change
  useEffect(() => {
    localStorage.setItem(
      "navPermissionActiveStates",
      JSON.stringify(activeStates)
    );
  }, [activeStates]);

  // Toggle the isActive state for an item
  const handleToggle = (url: string) => {
    setActiveStates((prev) => ({
      ...prev,
      [url]: !prev[url], // Flip the current state
    }));
  };

  // Lọc các mục hợp lệ
  const filteredItems = items.filter(
    (item) =>
      (item.allowedRoles?.includes(role) || !item.allowedRoles) &&
      (!item.permission || permissions.includes(item.permission))
  );

  // Nếu không có mục hợp lệ, ẩn SidebarGroupLabel
  if (filteredItems.length === 0) {
    return null;
  }
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Authentication</SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter(
            (item) =>
              (item.allowedRoles?.includes(role) || !item.allowedRoles) &&
              (!item.permission || permissions.includes(item.permission))
          )
          .map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={activeStates[item.url] || item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link
                    to={item.url}
                    onClick={() => {
                      setSelectedItem(item.url);
                      handleToggle(item.url);
                    }}
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`sidebar-link ${
                        selectedItem === item.url
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
                {item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link
                            to={subItem.url}
                            onClick={() => setSelectedItem(subItem.url)}
                          >
                            <SidebarMenuSubButton
                              asChild
                              className={`sidebar-link ${
                                selectedItem === subItem.url
                                  ? "bg-primary text-primary-foreground"
                                  : ""
                              }`}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
