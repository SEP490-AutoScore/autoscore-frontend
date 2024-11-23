import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Roles from "@/app/authentication/role/overview/app-role";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/roles",
    breadcrumbPage: "Roles Overview",
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
