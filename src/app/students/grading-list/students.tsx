import { useEffect, useState } from "react";

import { columns, Student } from "@/app/students/grading-list/comlums";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { DataTable } from "@/app/students/grading-list/data-table";
import { ErrorPage } from "@/app/authentication/error/page";
import { DataTableSkeleton } from "@/app/students/grading-list/data-skeleton";
import GradingProcess from "@/app/students/grading-process/grading-bar"

async function getData(examPaperId: number) {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.getStudent}?examPaperId=${examPaperId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error(
          "Failed to fetch scores:"
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
export default function ScorePage({ examPaperId }: { examPaperId: number }) {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      console.error("Source id is undefined!");
      return;
    }
  }, [examPaperId]);

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return <>
    <div className="flex flex-col p-4 pt-0">
      <DataTable columns={columns} data={data} examPaperId={examPaperId} />
      <GradingProcess />
    </div>

  </>
}
