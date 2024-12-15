import * as React from "react";
import {
  PieChart,
  UsersRound,
  Shield,
  BookOpen,
  Settings,
  NotebookPen,
  ChartSpline,
  Building2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
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

const data = {
  user: {
    id: Number(localStorage.getItem("id")) || 0,
    name: localStorage.getItem("name") || "unknown",
    email: localStorage.getItem("email") || "nN1xj@example.com",
    role: localStorage.getItem("role") || "unknown",
    position: localStorage.getItem("position") || "unknown",
    permissions: localStorage.getItem("permissions") || [],
    avatar:
      localStorage.getItem("picture") ||
      "https://img.myloview.cz/nalepky/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg",
    campus: localStorage.getItem("campus") || "unknown",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      allowedRoles: ["ADMIN", "EXAMINER", "LECTURER", "HEAD_OF_DEPARTMENT"],
      permission: "DASHBOARD",
      items: [],
    },
    {
      title: "Analysis",
      url: "/analysis",
      icon: ChartSpline,
      allowedRoles: ["ADMIN", "EXAMINER", "LECTURER", "HEAD_OF_DEPARTMENT"],
      permission: "DASHBOARD",
      items: [],
    },
  ],
  navPermission: [
    {
      title: "Accounts",
      url: "?",
      icon: UsersRound,
      allowedRoles: ["ADMIN", "EXAMINER", "HEAD_OF_DEPARTMENT"],
      permission: "VIEW_ACCOUNT",
      items: [
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
    {
      title: "Organization",
      url: "$$$",
      icon: Building2,
      allowedRoles: ["ADMIN"],
      permission: "ALL_ACCESS",
      items: [
        {
          title: "Organizations",
          url: "/organizations",
          permission: "ALL_ACCESS",
        },
        {
          title: "Positions",
          url: "/positions",
          permission: "ALL_ACCESS",
        },
      ],
    },
  ],
  navGrading: [
    {
      title: "Examination",
      url: "###",
      icon: BookOpen,
      allowedRoles: ["ADMIN", "EXAMINER", "LECTURER", "HEAD_OF_DEPARTMENT"],
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
      title: "Other",
      url: "!!",
      allowedRoles: ["ADMIN", "EXAMINER", "LECTURER", "HEAD_OF_DEPARTMENT"],
      icon: NotebookPen,
      items: [
        {
          title: "Subjects",
          url: "/subjects",
          permission: "VIEW_EXAM",
        },
        {
          title: "Semesters",
          url: "/semesters",
          permission: "VIEW_EXAM",
        },
      ],
    },
    {
      title: "Setting",
      url: "/ai-api-keys",
      allowedRoles: ["ADMIN", "EXAMINER", "LECTURER", "HEAD_OF_DEPARTMENT"],
      icon: Settings,
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
      ...data.navGrading,
    ];

    // Lọc các mục hợp lệ
    const validItem = allItems.find((item) => {
      const hasRole =
        !item.allowedRoles || item.allowedRoles.includes(userRole);
      const hasPermission =
        !item.permission || userPermissions.includes(item.permission);
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
        <AutoScoreSwitcher
          campus={data.user.campus.toString() || "FPT University"}
        />
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
          items={data.navGrading}
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
