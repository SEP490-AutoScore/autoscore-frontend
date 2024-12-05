import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Positions from "./app-position";
import { useLocation } from "react-router-dom";

export default function Page() {
  const Header = useHeader({
    breadcrumbPage: "Positions Overview",
  });
  const location = useLocation();
  const { reload } = location.state || {};
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Positions reload={reload} />
      </div>
    </SidebarInset>
  );
}
