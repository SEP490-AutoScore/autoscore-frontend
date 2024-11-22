import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Accounts from "@/app/authentication/account/overview/app-account";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/accounts",
    breadcrumbPage: "Accounts Overview",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Accounts />
      </div>
    </SidebarInset>
  );
}
