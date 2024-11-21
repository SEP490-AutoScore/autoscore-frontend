import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Roles from "@/app/authentication/role/app-role";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/permissions",
    breadcrumbPage: "Permissions Overview",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Roles />
      </div>
    </SidebarInset>
  );
}
