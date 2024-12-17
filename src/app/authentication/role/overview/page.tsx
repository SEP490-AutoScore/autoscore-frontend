import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Roles from "@/app/authentication/role/overview/app-role";
import { useLocation } from "react-router-dom";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/roles",
    breadcrumbPage: "Roles Overview",
  });
  const location = useLocation();
  const { reload } = location.state || {};
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Roles reload={reload} />
      </div>
    </SidebarInset>
  );
}
