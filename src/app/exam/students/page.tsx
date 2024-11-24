import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Students from "./app-students";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/exams",
    breadcrumbPage: "Exams Overview",
    breadcrumbPage_2: "Students",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <Students />
      </div>
    </SidebarInset>
  );
}
