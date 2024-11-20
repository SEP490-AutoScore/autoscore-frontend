import React from "react";
import PostmanForGrading from "./postman-for-grading";
import { SidebarInset } from "@/components/ui/sidebar"; // Import SidebarInset
import { useHeader } from "@/hooks/use-header"; // Nếu cần Header từ hook
import { useLocation } from "react-router-dom"; // Nếu cần lấy thông tin từ URL

const Page: React.FC = () => {
  // Lấy thông tin từ location hoặc state nếu cần
  const location = useLocation();
  const examPaperId = location.state?.examPaperId; // Hoặc lấy thông tin ID từ state

  // // Xử lý trường hợp không có thông tin
  // if (!examPaperId) {
  //   return <div>Error: Exam Paper ID not provided</div>;
  // }

  // Sử dụng Header từ hook (tùy chọn)
  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbLink_2: `/exams/detail/${examPaperId}`,
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: `Exam Paper ${examPaperId}`,
  });

  return (
    <SidebarInset>
      {Header}
      <PostmanForGrading />
    </SidebarInset>
  );
};

export default Page;
