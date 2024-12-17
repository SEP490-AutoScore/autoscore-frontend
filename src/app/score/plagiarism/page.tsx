import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import PlagiarismPage from "@/app/score/plagiarism/plagiarism";
import { useLocation } from "react-router-dom";

export default function Page() {
  const location = useLocation();
  const { examId, examPaperId, scoreId } = location.state || {};
  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbLink_2: `/exams/exam-papers`,
    breadcrumbPage_2: "Exam Details",
    breadcrumbPage_3: "Exam Papper detail",
    breadcrumbLink_3: "/exams/exam-papers/exam-questions",
    breadcrumbPage_4: "Plagiarism",
    stateGive: { examId: examId, examPaperId: examPaperId, scoreId: scoreId },
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
