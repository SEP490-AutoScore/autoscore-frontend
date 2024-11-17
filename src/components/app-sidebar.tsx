import * as React from "react";
import {
  PieChart,
  UsersRound,
  Shield,
  BookOpen,
  BadgeCheck,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { AutoScoreSwitcher } from "@/components/autoscore-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavPermission } from "./nav-permission";
import { NavGrading } from "./nav-grading";

// This is sample data.
const data = {
  user: {
    name: localStorage.getItem("name") || "uknown",
    email: localStorage.getItem("email") || "nN1xj@example.com",
    role: localStorage.getItem("role") || "unknown",
    position: localStorage.getItem("position") || "unknown",
    avatar: localStorage.getItem("picture") || "https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg",
    campus: localStorage.getItem("campus") || "uknown",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
      items: [],
    },
  ],
  navPermission: [
    {
      title: "Permissions",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Roles",
          url: "#",
        },
        {
          title: "All Permissions",
          url: "#",
        },
      ],
    },
    {
      title: "Accounts",
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "Add User",
          url: "#",
        },
        {
          title: "All Users",
          url: "#",
        },
      ],
    },
  ],
  navgrading: [
    {
      title: "Exams",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Add Exam",
          url: "#",
        },
        {
          title: "All Exams",
          url: "#",
        },
      ],
    },
    {
      title: "Scores",
      url: "/scores-overview",
      icon: BadgeCheck,
      items: [],
    },
    {
      title: "Setting",
      url: "/setting",
      icon: Settings,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AutoScoreSwitcher campus={data.user.campus.toString() || "FPT University"} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
        <NavPermission items={data.navPermission} />
        <NavGrading items={data.navgrading} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
