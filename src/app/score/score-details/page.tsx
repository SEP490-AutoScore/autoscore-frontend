import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ScoreDetails from "@/app/score/score-details/app-score-details";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/scores-overview",
    breadcrumbPage: "Scores Overview",
    breadcrumbLink_2: "/scores-overview/scores",
    breadcrumbPage_2: "Scores",
    breadcrumbLink_3: "/score-details",
    breadcrumbPage_3: "Score Details",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <ScoreDetails />
      </div>
    </SidebarInset>
  );
}