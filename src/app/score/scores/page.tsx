import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ScorePage from "@/app/score/scores/scores";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/scores-overview",
    breadcrumbPage: "Scores Overview",
    breadcrumbLink_2: "/scores",
    breadcrumbPage_2: "Scores",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <ScorePage />
      </div>
    </SidebarInset>
  );
}
