import * as React from "react";
import {
  PieChart,
  UsersRound,
  Shield,
  BookOpen,
  Settings,
  NotebookPen
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
    permissions: localStorage.getItem("permissions") || [],
    avatar:
      localStorage.getItem("picture") ||
      "https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg",
    campus: localStorage.getItem("campus") || "uknown",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      allowedRoles: ["ADMIN", "EXAMNIER"],
      permission: "DASHBOARD",
      items: [],
    },
  ],
  navPermission: [
    {
      title: "Accounts",
      url: "?",
      icon: UsersRound,
      allowedRoles: ["ADMIN"],
      permission: "VIEW_ACCOUNT",
      items: [
        // {
        //   title: "Add User",
        //   url: "##.",
        //   permission: "CREATE_ACCOUNT",
        // },
        {
          title: "Users",
          url: "/accounts",
          permission: "VIEW_ACCOUNT",
        },
      ],
    },
    {
      title: "Access",
      url: "#",
      icon: Shield,
      allowedRoles: ["ADMIN"],
      permission: "VIEW_PERMISSION",
      items: [
        {
          title: "Roles",
          url: "/roles",
          permission: "VIEW_ROLE",
        },
        {
          title: "Permissions",
          permission: "VIEW_PERMISSION",
          url: "/permissions",
        },
      ],
    },
  ],
  navgrading: [
    {
      title: "Examination",
      url: "###",
      icon: BookOpen,
      allowedRoles: ["ADMIN"],
      permission: "VIEW_EXAM",
      items: [
        {
          title: "Exams",
          url: "/exams",
          permission: "VIEW_EXAM",
        },
        {
          title: "Exam Papers",
          url: "/exam-papers",
          permission: "VIEW_EXAM",
        },
        {
          title: "Scores",
          url: "/scores-overview",
          permission: "VIEW_SCORE",
        },
      ],
    },
    {
      title: "Setting",
      url: "/ai-api-keys",
      allowedRoles: ["ADMIN", "EXAMNINER"],
      icon: Settings,
      items: [],
    },
    {
      title: "Grading",
      url: "/grading",
      allowedRoles: ["ADMIN", "EXAMNINER"],
      icon: NotebookPen,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Chuyển đổi `permissions` thành mảng
  const userPermissions = (localStorage.getItem("permissions") || "")
    .split(",")
    .map((permission) => permission.trim()); // Loại bỏ khoảng trắng dư thừa
  const userRole = localStorage.getItem("role") || "unknown";

  const getDefaultItem = () => {
    const allItems = [
      ...data.navMain,
      ...data.navPermission,
      ...data.navgrading,
    ];

    // Lọc các mục hợp lệ
    const validItem = allItems.find((item) => {
      const hasRole = !item.allowedRoles || item.allowedRoles.includes(userRole);
      const hasPermission = !item.permission || userPermissions.includes(item.permission);
      return hasRole && hasPermission;
    });

    return validItem ? validItem.url : null;
  };

  const [selectedItem, setSelectedItem] = React.useState<string | null>(() => {
    const savedItem = localStorage.getItem("selectedItem");
    if (savedItem) return savedItem;
    return getDefaultItem(); // Lấy mục hợp lệ đầu tiên
  });

  // Lưu `selectedItem` vào `localStorage`
  React.useEffect(() => {
    if (selectedItem) {
      localStorage.setItem("selectedItem", selectedItem);
    }
  }, [selectedItem]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AutoScoreSwitcher campus={data.user.campus.toString() || "FPT University"} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          role={userRole}
          permissions={userPermissions}
        />
        <NavPermission
          items={data.navPermission}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          role={userRole}
          permissions={userPermissions}
        />
        <NavGrading
          items={data.navgrading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          role={userRole}
          permissions={userPermissions}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={data.user}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}