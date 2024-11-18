import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ExamInfo from "@/components/exam-info"; // Đường dẫn đúng trong dự án của bạn

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/exam/examPaper",
    breadcrumbPage: "Exam Paper",
  });

  return (
    <SidebarInset>
      {Header}
      <div>
        {/* Truyền ID kỳ thi để ExamInfo tự lấy thông tin */}
        <ExamInfo examId={1} />
      </div>
    </SidebarInset>
  );
}
