import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import SemesterOverview from "@/app/semester/semesters/semester-overview";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/scores-overview",
    breadcrumbPage: "Scores Overview",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <SemesterOverview />
      </div>
    </SidebarInset>
  );
}
