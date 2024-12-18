"use client";

import { useState, useEffect } from "react";
import { PlagiarismComparison } from "@/app/score/plagiarism/comparison";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { NoResultPage } from "@/app/authentication/error/page";

export interface CodePlagiarism {
  codePlagiarismId: number;
  selfCode: string;
  studentCodePlagiarism: string;
  plagiarismPercentage: string;
  studentPlagiarism: string;
  type: string;
}

async function fetchCodePlagiarism(scoreId: number): Promise<CodePlagiarism[]> {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.plagiarism}?scoreId=${scoreId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (!response.ok) {
      let errorDetails = "Failed to fetch code plagiarism data";
      try {
        const errorBody = await response.json();
        errorDetails = errorBody.message || errorDetails;
      } catch {
        errorDetails = await response.text() || errorDetails;
      }
      throw new Error(errorDetails);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}

export default function PlagiarismPage() {
  const [plagiarismData, setPlagiarismData] = useState<CodePlagiarism[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { scoreId } = location.state || {}

  useEffect(() => {
    const fetchData = async () => {
      if (!scoreId) {
        setError("No score ID provided")
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCodePlagiarism(scoreId)
        setPlagiarismData(data)
      } catch (err) {
        setError("Failed to fetch plagiarism data. Please try again." + err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [scoreId])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Code Plagiarism Analysis</h1>
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && plagiarismData.length === 0 && (
        // <p>
        //   No plagiarism data found.
        // </p>
        <NoResultPage/>
      )}
      <div className="space-y-6">
        {plagiarismData.map((item) => (
          <PlagiarismComparison key={item.codePlagiarismId} data={item} />
        ))}
      </div>
    </div>
  );
}
