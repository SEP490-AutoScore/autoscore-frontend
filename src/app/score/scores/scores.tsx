import { useEffect, useState } from "react";

import { Score, columns } from "@/app/score/scores/columns";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { DataTable } from "@/app/score/scores/data-table";
import { ErrorPage } from "@/app/authentication/error/page";
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

interface ScorePageProps {
  exportListScore: () => Promise<void>;
  exportLogRun: () => Promise<void>;
  examId: number;
  examPaperId: number;
}
export default function ScorePage({ exportListScore, exportLogRun, examId, examPaperId }: ScorePageProps) {
  const [data, setData] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getData(examPaperId)
      .then((fetchedData) => {
        const scoresWithExamId = fetchedData.map((score: Score) => ({
          ...score,
          examId: examId,
          examPaperId: examPaperId,
        }));
        setData(scoresWithExamId);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    if (!examPaperId) {
      console.error("exampaperid is undefined!");
      return;
    }
  }, [examPaperId, examId]);

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return <DataTable columns={columns} data={data} exportListScore={exportListScore} exportLogRun={exportLogRun}/>;
}
