import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Organization from "./app-organization";
// import { useLocation } from "react-router-dom";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/permissions",
    breadcrumbPage: "Permissions Overview",
  });
//   const location = useLocation();
//   const { reload } = location.state || {};
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Organization />
      </div>
    </SidebarInset>
  );
}
