import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import RoleDetail from "@/app/authentication/role/detail/app-permission";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/roles",
    breadcrumbPage: "Roles Overview",
    breadcrumbPage_2: "Role Details",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <RoleDetail />
      </div>
    </SidebarInset>
  );
}
