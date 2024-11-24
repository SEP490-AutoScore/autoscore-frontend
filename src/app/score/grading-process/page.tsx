import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import OverView from "@/app/score/grading-process/overview"

export default function Page() {
  const Header = useHeader({
    breadcrumbPage: "Grading Process",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <OverView/>
      </div>
    </SidebarInset>
  );
}
