import { useEffect, useState } from "react";
import { Subject, columns } from "../score/columns-overview";
import {
  SidebarInset,
} from "@/components/ui/sidebar";
import { DataTableOverview } from "./data-table-overview";
import { useHeader } from "@/hooks/use-header";

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

export default function ScoreOverviewPage() {
  const Header = useHeader({
    breadcrumbLink: "/scoresOverview",
    breadcrumbPage: "Score Overview",
  });
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
      <SidebarInset>
        {Header}
        <div className="p-4 pt-0">
          <DataTableOverview columns={columns} data={data} />
        </div>
      </SidebarInset>
  );
}
