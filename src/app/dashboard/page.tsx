import { useHeader } from "@/hooks/use-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardHeaderDashboard } from "./card-header";
import { Book } from "lucide-react";
import { BarChartComponent } from "./bar-chart";
import { PieChartComponent } from "./pie-chart";
import { LineChartComponent } from "./line-chart";
import { DataTableDemo } from "./data-table";
import { BarChartHorizontalComponent } from "./bar-chart-horizontal";

export default function Page() {
  const Header = useHeader({
    breadcrumbLink: "/dashboard",
    breadcrumbPage: "Dashboard",
  });
  return (
    <SidebarInset>
      {Header}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2">
            <CardHeaderDashboard
              title="Dashboard"
              content="Welcome to Dashboard"
              description="Overview"
              icon={Book}
            />
          </div>
          <div className="col-span-2">
            <CardHeaderDashboard
              title="Dashboard"
              content="Welcome to Dashboard"
              description="Overview"
              icon={Book}
            />
          </div>
          <div className="col-span-2">
            <CardHeaderDashboard
              title="Dashboard"
              content="Welcome to Dashboard"
              description="Overview"
              icon={Book}
            />
          </div>
          <div className="col-span-2">
            <CardHeaderDashboard
              title="Dashboard"
              content="Welcome to Dashboard"
              description="Overview"
              icon={Book}
            />
          </div>
          <div className="col-span-4">
            <BarChartComponent />
          </div>
          <div className="col-span-4">
            <LineChartComponent />
          </div>
          <div className="col-span-4 border border-gray-200 p-4 rounded-lg shadow">
            <DataTableDemo />
          </div>
          <div className="col-span-2">
            <BarChartHorizontalComponent />
          </div>
          <div className="col-span-2">
            <PieChartComponent />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
