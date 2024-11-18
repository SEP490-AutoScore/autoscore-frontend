import { useEffect, useState } from "react";

import { Score, columns } from "@/app/score/scores/columns";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { DataTable } from "@/app/score/scores/data-table";
import { useLocation } from "react-router-dom";
import { ErrorPage } from "@/app/error/page";
import { DataTableSkeleton } from "../scores/data-table-skeleton";

async function getData(exampaperid: number) {
  try {
    if (!exampaperid) {
      return <div>Please select an exam paper to view scores.</div>;
    }
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
        console.error(
          "Failed to fetch scores:",
          localStorage.getItem("jwtToken")
        );
        return [];
      } else throw new Error("Failed to fetch scores");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export default function ScorePage() {
  const [data, setData] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { examPaperId } = location.state || {};

  useEffect(() => {
    setLoading(true);
    getData(examPaperId)
      .then((fetchedData) => {
        setData(fetchedData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    if (!examPaperId) {
      console.error("exampaperid is undefined!");
      return;
    }
  }, [examPaperId]);

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return <DataTable columns={columns} data={data} />;
}
