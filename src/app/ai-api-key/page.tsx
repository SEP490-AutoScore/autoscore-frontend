import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import AIApiKeyPage from "@/app/ai-api-key/app-api-key";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/ai-api-keys",
    breadcrumbPage: "AI API Keys",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="flex p-4 pt-0">
        <AIApiKeyPage />
      </div>
    </SidebarInset>
  );
}
