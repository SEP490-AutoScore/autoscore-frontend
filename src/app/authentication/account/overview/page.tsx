import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Accounts from "@/app/authentication/account/overview/app-account";
import { useLocation } from "react-router-dom";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/accounts",
    breadcrumbPage: "Accounts Overview",
  });
  const location = useLocation();
  const { reload } = location.state || {};
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Accounts reload={reload} />
      </div>
    </SidebarInset>
  );
}
