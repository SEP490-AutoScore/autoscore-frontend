import { useHeader } from "@/hooks/use-header";
// import ScoreDetailsTable from "@/app/score/score-details/score-details-table";
import { SidebarInset } from "@/components/ui/sidebar";

const ScoreDetailPage = () => {
  const Header = useHeader({
    breadcrumbLink: "/score-details",
    breadcrumbPage: "Score Details",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        
      </div>
    </SidebarInset>
  );
};

export default ScoreDetailPage;
