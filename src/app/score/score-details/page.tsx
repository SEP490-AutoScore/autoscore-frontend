import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ScoreDetails from "@/app/score/score-details/app-score-details";
import { useLocation } from "react-router-dom";

export default function Page() {
  const location = useLocation();
  const { examId, examPaperId } = location.state || {};
  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbLink_2: `/exams/exam-papers`,
    breadcrumbPage_2: "Exam Details",
    breadcrumbPage_3: "Exam Papper detail",
    breadcrumbLink_3: "/exams/exam-papers/exam-questions",
    breadcrumbPage_4: "Score Details",
    stateGive: { examId: examId, examPaperId: examPaperId},
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