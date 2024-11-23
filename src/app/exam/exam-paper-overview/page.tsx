import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ExamPapers from "@/app/exam/exam-paper-overview/exam-papers-overview";

export default function Page() {
  const Header = useHeader({
    breadcrumbPage: "Exam Papers Overview",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <ExamPapers />
      </div>
    </SidebarInset>
  );
}
