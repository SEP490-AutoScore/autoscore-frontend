import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Page() {
    const Header = useHeader({
        breadcrumbLink: "/exams",
        breadcrumbPage: "Exams Overview",
        breadcrumbLink_2: "/exam-papers",
        breadcrumbPage_2: "Exam Papers",
    });

    return (
        <SidebarInset>
            {Header}
        </SidebarInset>
    );
}