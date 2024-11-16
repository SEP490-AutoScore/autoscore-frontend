import "./App.css";
import Page from "./app/dashboard/page";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Page />
    </SidebarProvider>
  );
}
export default App;
