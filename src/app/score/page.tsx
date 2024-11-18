import { useEffect, useState } from "react";

import { Score, columns } from "@/components/columns";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { SidebarInset } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { useHeader } from "@/hooks/use-header";

async function getData(exampaperid: number) {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.score}?exampaperid=${exampaperid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Failed to fetch scores:", localStorage.getItem("jwtToken"));
        return [];
      }
      throw new Error("Failed to fetch scores");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function ScorePage() {
  const Header = useHeader({
    breadcrumbLink: "/scores",
    breadcrumbPage: "Score",
  });
  const [data, setData] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exampaperid, ] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData(exampaperid);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [exampaperid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarInset>
      {Header}
      <div className="p-4 pt-0">
        <DataTable columns={columns} data={data} />
      </div>
    </SidebarInset>
  );
}
