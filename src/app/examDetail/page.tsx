import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import ExamInfo from "@/components/exam-info"; // Đường dẫn đúng trong dự án của bạn
import Detail from "./detail";

interface examPaper{
  examPaperCode: string;
}

const code = "2";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/exam/examPaper",
    breadcrumbPage: "Exam Paper " + code,
  });

  if (code.match("2")) {
    return (
      <SidebarInset>
        {Header}
          {/* Truyền ID kỳ thi để ExamInfo tự lấy thông tin */}
          <ExamInfo examId={1} />
          {/* Truyền ID kỳ thi để ExamInfo tự lấy thông tin */}
          <Detail examId={1}/>
      </SidebarInset>
    );
  } else {
    return (
      <SidebarInset>
        {Header}
          {/* Truyền ID kỳ thi để ExamInfo tự lấy thông tin */}
          <ExamInfo examId={1} />
          {/* Truyền ID kỳ thi để ExamInfo tự lấy thông tin */}
          {/* <Detail/> */}
      </SidebarInset>
    );
  }

  
}
