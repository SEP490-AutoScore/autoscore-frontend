import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import SubjectOverview from "@/app/semester/subjects/subject-overview";

export default function Page() {
  const Header = useHeader({
    breadcrumbPage: "Subject Overview",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <SubjectOverview />
      </div>
    </SidebarInset>
  );
}
