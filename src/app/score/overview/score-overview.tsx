import { useEffect, useState } from "react";
import { ScoredExam, columns } from "./columns-overview";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { DataTableOverview } from "./data-table-overview";
import { DataTableSkeleton } from "./data-table-skeleton";
import { ErrorPage } from "@/app/authentication/error/page";

async function getData(): Promise<ScoredExam[]> {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.scoreOverview}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    const error = await response.text();
    throw new Error(`Failed to fetch data: ${error}`);
  }

  const data: ScoredExam[] = await response.json();
  return data;
}

export default function ScoreOverviewPage() {
  const [data, setData] = useState<ScoredExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getData()
      .then((fetchedData) => {
        setData(fetchedData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return <ErrorPage />;
  }

  // if (data.length === 0|| data === null) {
  //   return <NoResultPage />;
  // }

  return <DataTableOverview columns={columns} data={data} />;
}
