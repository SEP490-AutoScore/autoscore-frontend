import { useHeader } from "@/hooks/use-header";
import { useLocation } from "react-router-dom"; // Import useLocation để lấy state từ Link
import { SidebarInset } from "@/components/ui/sidebar";
import Student from "@/app/students/grading-list/students"

export default function Page() {
  const Header = useHeader({
    breadcrumbPage: "Grading Process",
    breadcrumbLink: "/grading",
    breadcrumbPage_2: "Students"
  });
  const location = useLocation(); // Dùng useLocation để lấy state
  const sourceId = location.state?.sourceId;

  return (
    <SidebarInset>
      {Header}
      <Student sourceId={sourceId}/>
    </SidebarInset>
  );
}
