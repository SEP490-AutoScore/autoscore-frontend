import { useHeader } from "@/hooks/use-header";
import { useLocation } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import ExamInfo from "./exam-info"; // Đường dẫn đúng trong dự án của bạn
import Detail from "./exam-detail";
import { ErrorPage } from '@/app/error/page';


export default function Page() {

  const location = useLocation();
  const id = location.state?.examId; // Lấy `examId` từ state

  if (!id) {
    return <div>Error: Exam ID not provided</div>; // Xử lý khi thiếu ID
  }


  const role = localStorage.getItem("role");
  if (role == null) {
    return (
      <ErrorPage />
    )
  }

  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbLink_2: `/exams/detail/${id}`,
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: `Exam Paper ${id}`,
  })

  if (role.match("ADMIN")) {
    return (
      <SidebarInset>
        {Header}
        {/* Truyền ID kỳ thi để ExamInfo tự lấy thông tin */}
        <ExamInfo examId={Number(id)} />
        <div style={{ margin: "15px 4%", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", marginTop: "16px", minHeight: "100px" }}>
          <Detail examId={Number(id)} />
        </div>
      </SidebarInset>
    );
  } else {
    return (
      <SidebarInset>
        {Header}
        <ExamInfo examId={Number(id)} />
      </SidebarInset>
    );
  }
}
