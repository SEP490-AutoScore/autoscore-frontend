import { useEffect, useState } from "react";
import { Subject, columns } from "../score/columns-overview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataTableOverview } from "./data-table-overview";

async function getData(): Promise<Subject[]> {
  // Fetch data from your API here.
  return [
    {
      code: "PE_PRN231_FA24_006006",
      semester: "FA24",
      status: "pending",
      subject: "PRN231",
    },
    {
      code: "PE_PRN231_FA23_006005",
      semester: "FA23",
      status: "success",
      subject: "PRN231",
    },

    // ...
  ];
}

export default function ScorePage() {
  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/scores-overview">Scores</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4 pt-0">
          <DataTableOverview columns={columns} data={data} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
