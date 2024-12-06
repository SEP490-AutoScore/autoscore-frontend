import { useEffect, useState } from "react";

import { Semester, columns } from "@/app/semester/semesters/columns";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { DataTable } from "@/app/semester/semesters/data-table";
import { ErrorPage } from "@/app/authentication/error/page";
import { DataTableSkeleton } from "@/app/semester/semesters/data-table-skeleton";

async function getData() {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.getSemester}`,
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
export default function SemesterPage() {
  const [data, setData] = useState<Semester[]>([]);
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
  }, []); // Add an empty dependency array here

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return <DataTable columns={columns} data={data} />;
}
