import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import PlagiarismPage from "@/app/score/plagiarism/plagiarism";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/scores-overview",
    breadcrumbPage: "Scores Overview",
    breadcrumbLink_2: "/scores-overview/scores",
    breadcrumbPage_2: "Scores",
    breadcrumbLink_3: "/plagiarism",
    breadcrumbPage_3: "Plagiarism",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <PlagiarismPage />
      </div>
    </SidebarInset>
  );
}