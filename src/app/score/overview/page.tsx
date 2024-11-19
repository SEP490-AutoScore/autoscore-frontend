import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ScoreOverview from "@/app/score/overview/score-overview";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/scoresOverview",
    breadcrumbPage: "Scores Overview",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <ScoreOverview />
      </div>
    </SidebarInset>
  );
}
