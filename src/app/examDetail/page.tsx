import { useHeader } from "@/hooks/use-header";
import { useLocation } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import ExamInfo from "./exam-info"; // Đường dẫn đúng trong dự án của bạn
import Detail from "./exam-detail";
import { ErrorPage } from '@/app/authentication/error/page';


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
        <div className="w-full h-screen mx-[3%] my-[20px] p-4 border border-gray-300 rounded-lg min-h-[100px]">
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
